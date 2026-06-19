import { IMeritProfile10 } from '../../0-domain/contracts/IComponentCore.ts';
import {
  IAttributeConverter,
  IVirtueEngine,
  PartnerAttributes,
} from '../../0-domain/contracts/IVirtueEngine.ts';

/**
 * 🌟 Default Virtue Converter: Maps virtues (1-10) to game attributes
 * --------------------------------------------------
 * Benevolence  -> HP & Tolerance
 * Intelligence -> MP & Focus
 * Courage      -> ATK
 * Temperance   -> DEF
 * Harmony      -> SPEED
 * Integrity    -> LUCK (Core Stability)
 */
export class DefaultAttributeConverter implements IAttributeConverter {
  convert(virtues: IMeritProfile10): PartnerAttributes {
    return {
      hp: 100 + virtues.benevolence * 20,
      mp: 50 + virtues.intelligence * 15,
      atk: 10 + virtues.courage * 5,
      def: 5 + virtues.temperance * 4,
      speed: 10 + virtues.harmony * 3,
      luck: virtues.integrity * 2,
      focus: 20 + virtues.intelligence * 5,
    };
  }
}

/**
 * 🏛️ VirtueEngine: Process IMeritProfile10 into PartnerAttributes
 */
export class VirtueEngine implements IVirtueEngine {
  private converter: IAttributeConverter;

  constructor(converter: IAttributeConverter = new DefaultAttributeConverter()) {
    this.converter = converter;
  }

  calculateAttributes(virtues: IMeritProfile10): PartnerAttributes {
    return this.converter.convert(virtues);
  }

  /** Update converter (for scaling different formats or modes) */
  setConverter(converter: IAttributeConverter): void {
    this.converter = converter;
  }
}
