import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';

export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

@Injectable()
export class VectorStoreService {
  private vectors: Map<string, VectorDocument> = new Map();

  constructor(private embeddingsService: EmbeddingsService) {}

  async addDocument(
    id: string,
    content: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const embedding = await this.embeddingsService.generateEmbedding(content);
    this.vectors.set(id, {
      id,
      content,
      embedding,
      metadata,
    });
  }

  async searchSimilar(query: string, topK: number = 3): Promise<VectorDocument[]> {
    const queryEmbedding =
      await this.embeddingsService.generateEmbedding(query);

    const scores = Array.from(this.vectors.values()).map((doc) => ({
      doc,
      score: this.cosineSimilarity(
        queryEmbedding,
        doc.embedding,
      ),
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => item.doc);
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }

  getDocument(id: string): VectorDocument | undefined {
    return this.vectors.get(id);
  }

  getAllDocuments(): VectorDocument[] {
    return Array.from(this.vectors.values());
  }

  clear(): void {
    this.vectors.clear();
  }
}
