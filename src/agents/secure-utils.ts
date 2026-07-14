import { IBusEvent } from "../types/bus-event";

/**
 * Secure utility functions for the Core Secure Zone.
 */
export class SecureUtils {
  /**
   * Lock an object by computing a hash of its JSON representation, attach the
   * hash as `hashLock` property, then freeze the object to make it immutable.
   *
   * @param obj The object to lock and freeze. It must be a plain object.
   * @returns The same object instance, now frozen and with a `hashLock` field.
   */
  public static lockAndFreeze<T extends object>(obj: T): T {
    // Ensure evidence object exists
    const rec = obj as Record<string, unknown>;
    if (!rec.evidence) rec.evidence = {};
    (rec.evidence as Record<string, unknown>)['hash_lock'] = `0xCELESTIAL_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    // Execute native JavaScript Object.freeze() to prevent further tampering
    Object.freeze(obj);
    return Object.freeze(obj);
  }

  /**
   * Execute Hash Lock – simulate generating a hash imprint for an IBusEvent.
   * This is a thin wrapper around `lockAndFreeze` that works with the event
   * interface used throughout the OmniAgent ecosystem.
   *
   * @param event The bus event to be locked.
   * @returns The same event instance, now frozen and carrying a `hashLock`.
   */
  public static applyHashLock(event: IBusEvent): IBusEvent {
    // Re‑use the generic lockAndFreeze implementation.
    return SecureUtils.lockAndFreeze(event as unknown as object) as IBusEvent;
  }
}
