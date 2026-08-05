// Omni-Blueprint Hub - Core Engine
import crypto from 'crypto';
import {
  IComponentCore,
  BlueprintType,
  BlueprintDefinition,
  BlueprintProduct,
  BroadcastPayload,
  UnifiedBlueprintEntity
} from './core-types';

export class OmniBlueprintHub {
  private singleDataTable: Map<string, UnifiedBlueprintEntity> = new Map();

  public createBlueprint(
    type: BlueprintType,
    name: string,
    hostEmail: string,
    sourceEndpoint: string,
    targetLanguages: string[]
  ): BlueprintDefinition {
    const uuid = `uuid-${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();

    const blueprint: BlueprintDefinition = {
      uuid,
      version: 'v0.5.0',
      timestamp,
      type,
      name,
      hostEmail,
      sourceEndpoint,
      targetLanguages,
      evidence: [{
        event: 'BLUEPRINT_CREATED',
        source_origin: 'OmniBlueprintHub.createBlueprint',
        iso_standard: 'ISO-14064-1',
        timestamp
      }]
    };

    const hashLock = this.generateHashLock(blueprint);
    blueprint.hashLock = hashLock;

    this.saveToSingleTable({
      id: blueprint.uuid,
      entityType: 'BLUEPRINT',
      blueprintType: type,
      hostEmail,
      payload: { ...blueprint },
      hashLock,
      createdAt: timestamp
    });

    return Object.freeze(blueprint);
  }

  public manifestToProduct(blueprint: BlueprintDefinition): BlueprintProduct {
    const productUuid = `prod-${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();
    let broadcastUrl: string | undefined;

    if (blueprint.type === 'DESIGNATED_URL_BROADCAST') {
      const shareToken = crypto.createHash('sha256')
        .update(`${blueprint.uuid}:${blueprint.hostEmail}:${timestamp}`)
        .digest('hex').substring(0, 10);
      broadcastUrl = `https://esggo.app/live-sync?host=${encodeURIComponent(blueprint.hostEmail)}&token=5T-${shareToken}`;
    }

    const product: BlueprintProduct = {
      uuid: productUuid,
      version: blueprint.version,
      timestamp,
      blueprintId: blueprint.uuid,
      productName: `[萬能藍圖產品] ${blueprint.name}`,
      broadcastUrl,
      status: 'RUNNING',
      activeViewers: blueprint.type === 'DESIGNATED_URL_BROADCAST' ? 1 : 0,
      payloadStream: [],
      evidence: [
        ...blueprint.evidence,
        { event: 'PRODUCT_MANIFESTED', source_origin: 'OmniBlueprintHub.manifestToProduct', broadcastUrl, timestamp }
      ]
    };

    const hashLock = this.generateHashLock(product);
    this.saveToSingleTable({
      id: product.uuid,
      entityType: 'PRODUCT',
      blueprintType: blueprint.type,
      hostEmail: blueprint.hostEmail,
      payload: { ...product },
      hashLock,
      createdAt: timestamp
    });

    return product;
  }

  public pushBroadcastPayload(
    product: BlueprintProduct,
    originEmailText: string,
    translations: Record<string, string>
  ): BlueprintProduct {
    if (product.status !== 'RUNNING') {
      throw new Error('【狀態機違規】產品非執行狀態 (RUNNING)，無法推播。');
    }
    const logId = `log-${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();
    const sourceOrigin = `EmailHost:${product.blueprintId}`;
    const payloadHash = crypto.createHash('sha256')
      .update(`${originEmailText}:${JSON.stringify(translations)}:${timestamp}`)
      .digest('hex');

    const streamItem: BroadcastPayload = {
      id: logId,
      originText: originEmailText,
      translatedText: translations,
      sourceOrigin,
      hash: payloadHash,
      timestamp
    };
    product.payloadStream.unshift(streamItem);

    this.saveToSingleTable({
      id: logId,
      entityType: 'BROADCAST_LOG',
      blueprintType: product.broadcastUrl ? 'DESIGNATED_URL_BROADCAST' : 'LIVE_BROADCAST',
      hostEmail: product.productName,
      payload: { ...streamItem, productId: product.uuid },
      hashLock: payloadHash,
      createdAt: timestamp
    });

    return product;
  }

  public freezeProduct(product: BlueprintProduct): Readonly<BlueprintProduct> {
    product.status = 'FROZEN';
    product.evidence.push({
      event: 'PRODUCT_FROZEN',
      hashLock: this.generateHashLock(product),
      timestamp: new Date().toISOString()
    });
    return Object.freeze(product);
  }

  public getUnifiedTable(): UnifiedBlueprintEntity[] {
    return Array.from(this.singleDataTable.values());
  }

  private generateHashLock(data: object): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  private saveToSingleTable(entity: UnifiedBlueprintEntity): void {
    this.singleDataTable.set(entity.id, entity);
  }
}
