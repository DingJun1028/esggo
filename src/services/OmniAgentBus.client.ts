import { Observable, defer, Subject } from 'rxjs';

export interface IMiaoDeNotification {
  readonly uuid: string;
  readonly essence: string;
  readonly miaoDeUtility: unknown;
  readonly isUnimpeded: boolean;
}

class OmniAgentBusClient {
  private static instance: OmniAgentBusClient;
  private supremeWillOcean$ = new Subject<string>();

  private constructor() {}

  public static getUnimpededInstance(): OmniAgentBusClient {
    if (!OmniAgentBusClient.instance) {
      OmniAgentBusClient.instance = new OmniAgentBusClient();
    }
    return OmniAgentBusClient.instance;
  }

  public manifestSupremeWill(_will: string): void {
    console.log(`[Client] Intent manifested`);
  }

  public observeSupremeWill(): Observable<string> {
    return defer(() => this.supremeWillOcean$);
  }

  public broadcastSupremeWill(will: string): void {
    this.supremeWillOcean$.next(will);
    this.manifestSupremeWill(will);
  }
}

export const omniAgentBus = OmniAgentBusClient.getUnimpededInstance();
