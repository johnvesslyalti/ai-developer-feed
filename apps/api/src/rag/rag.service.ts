import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { VectorStoreService } from './vector-store.service';
import { DEMO_DOCUMENTS, Document } from './demo-data';

@Injectable()
export class RAGService {
  private client: OpenAI;
  private initialized = false;

  constructor(private vectorStore: VectorStoreService) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async initializeDemoData(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.vectorStore.clear();
    for (const doc of DEMO_DOCUMENTS) {
      await this.vectorStore.addDocument(doc.id, doc.content, {
        title: doc.title,
      });
    }
    this.initialized = true;
  }

  async ingestDocuments(documents: Document[]): Promise<void> {
    for (const doc of documents) {
      await this.vectorStore.addDocument(doc.id, doc.content, {
        title: doc.title,
      });
    }
  }

  async retrieveRelevantDocs(query: string, topK: number = 3) {
    return await this.vectorStore.searchSimilar(query, topK);
  }

  async query(userQuery: string): Promise<string> {
    // Retrieve relevant documents
    const relevantDocs = await this.vectorStore.searchSimilar(userQuery, 3);

    // Build context from retrieved documents
    const context = relevantDocs
      .map(
        (doc) =>
          `Title: ${doc.metadata?.title || 'Unknown'}\nContent: ${doc.content}`,
      )
      .join('\n\n');

    // Create prompt with context
    const systemPrompt = `You are a helpful AI assistant. Use the provided context to answer questions accurately.
If the context doesn't contain relevant information, say so honestly.

Context:
${context}`;

    // Call OpenAI API
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userQuery,
        },
      ],
    });

    const textContent = response.choices[0]?.message?.content;
    return textContent || 'No response generated';
  }

  getDocuments() {
    return this.vectorStore.getAllDocuments().map((doc) => ({
      id: doc.id,
      title: doc.metadata?.title,
      content: doc.content,
    }));
  }
}
