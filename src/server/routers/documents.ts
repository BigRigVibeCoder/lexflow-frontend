import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, ilike, or, desc, sql } from "drizzle-orm";
import { router, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { documents, documentAccessLog } from "@/lib/db/schema";
import { validateFile, storeFile, readFile } from "@/lib/document-storage";
import { logger } from "@/lib/logger";

/** Document tRPC router — permission-gated document CRUD. */
export const documentsRouter = router({
  /** List documents with filters. */
  list: permissionProcedure("document:read")
    .input(z.object({
      matterId: z.string().uuid().optional(),
      category: z.enum(["pleading", "correspondence", "medical_record", "billing", "evidence", "court_order", "other"]).optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      pageSize: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const conditions = [eq(documents.isDeleted, false)];
      if (input.matterId) conditions.push(eq(documents.matterId, input.matterId));
      if (input.category) conditions.push(eq(documents.category, input.category));
      if (input.search) {
        conditions.push(or(
          ilike(documents.title, `%${input.search}%`),
          ilike(documents.originalFilename, `%${input.search}%`),
        )!);
      }
      const offset = (input.page - 1) * input.pageSize;
      const [rows, countResult] = await Promise.all([
        db.select().from(documents).where(and(...conditions)).orderBy(desc(documents.createdAt)).limit(input.pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(documents).where(and(...conditions)),
      ]);
      const total = Number(countResult[0]?.count ?? 0);
      return { data: rows, pagination: { page: input.page, pageSize: input.pageSize, total, totalPages: Math.ceil(total / input.pageSize) } };
    }),

  /** Get single document by ID. */
  getById: permissionProcedure("document:read")
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const [doc] = await db.select().from(documents).where(and(eq(documents.id, input.id), eq(documents.isDeleted, false)));
      if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      if (ctx.session?.user?.id) {
        await db.insert(documentAccessLog).values({ documentId: input.id, userId: ctx.session.user.id, action: "view" });
      }
      return doc;
    }),

  /** Upload a document (base64-encoded for tRPC transport). */
  upload: permissionProcedure("document:upload")
    .input(z.object({
      matterId: z.string().uuid(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      category: z.enum(["pleading", "correspondence", "medical_record", "billing", "evidence", "court_order", "other"]).default("other"),
      originalFilename: z.string().min(1),
      mimeType: z.string().min(1),
      fileBase64: z.string(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const buffer = Buffer.from(input.fileBase64, "base64");
      const validationError = validateFile(input.originalFilename, input.mimeType, buffer.length);
      if (validationError) throw new TRPCError({ code: "BAD_REQUEST", message: validationError });
      const storedFilename = await storeFile(buffer, input.originalFilename);
      const userId = ctx.session?.user?.id ?? "system";
      const [doc] = await db.insert(documents).values({
        matterId: input.matterId,
        title: input.title,
        description: input.description ?? null,
        category: input.category,
        originalFilename: input.originalFilename,
        storedFilename,
        mimeType: input.mimeType,
        sizeBytes: buffer.length,
        uploadedById: userId,
        tags: input.tags ?? [],
      }).returning();
      logger.info({ documentId: doc.id, filename: input.originalFilename, size: buffer.length }, "document.uploaded");
      return doc;
    }),

  /** Update document metadata. */
  update: permissionProcedure("document:upload")
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      category: z.enum(["pleading", "correspondence", "medical_record", "billing", "evidence", "court_order", "other"]).optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const [doc] = await db.update(documents)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(documents.id, id), eq(documents.isDeleted, false)))
        .returning();
      if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      logger.info({ documentId: id }, "document.updated");
      return doc;
    }),

  /** Soft-delete a document. */
  delete: permissionProcedure("document:delete")
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const [doc] = await db.update(documents)
        .set({ isDeleted: true, updatedAt: new Date() })
        .where(eq(documents.id, input.id))
        .returning();
      if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      if (ctx.session?.user?.id) {
        await db.insert(documentAccessLog).values({ documentId: input.id, userId: ctx.session.user.id, action: "delete" });
      }
      logger.info({ documentId: input.id }, "document.soft_deleted");
      return { success: true };
    }),

  /** Download file content (returns base64). */
  download: permissionProcedure("document:read")
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const [doc] = await db.select().from(documents).where(and(eq(documents.id, input.id), eq(documents.isDeleted, false)));
      if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      const fileBuffer = await readFile(doc.storedFilename);
      if (!fileBuffer) throw new TRPCError({ code: "NOT_FOUND", message: "File not found on disk" });
      if (ctx.session?.user?.id) {
        await db.insert(documentAccessLog).values({ documentId: input.id, userId: ctx.session.user.id, action: "download" });
      }
      logger.info({ documentId: input.id }, "document.downloaded");
      return { filename: doc.originalFilename, mimeType: doc.mimeType, fileBase64: fileBuffer.toString("base64") };
    }),

  /** Search documents across all matters. */
  search: permissionProcedure("document:read")
    .input(z.object({ query: z.string().min(1), page: z.number().default(1), pageSize: z.number().default(20) }))
    .query(async ({ input }) => {
      const searchConditions = and(
        eq(documents.isDeleted, false),
        or(
          ilike(documents.title, `%${input.query}%`),
          ilike(documents.originalFilename, `%${input.query}%`),
          ilike(documents.description, `%${input.query}%`),
        ),
      );
      const offset = (input.page - 1) * input.pageSize;
      const [rows, countResult] = await Promise.all([
        db.select().from(documents).where(searchConditions).orderBy(desc(documents.createdAt)).limit(input.pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(documents).where(searchConditions),
      ]);
      const total = Number(countResult[0]?.count ?? 0);
      return { data: rows, pagination: { page: input.page, pageSize: input.pageSize, total, totalPages: Math.ceil(total / input.pageSize) } };
    }),
});
