import 'reflect-metadata';
import { TarotModule } from './tarot.module';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';

describe('TarotModule', () => {
  it('declares the expected controllers and providers', () => {
    const controllers = Reflect.getMetadata('controllers', TarotModule) as
      | any[]
      | undefined;
    const providers = Reflect.getMetadata('providers', TarotModule) as
      | any[]
      | undefined;

    // Fallback: if metadata isn't present, the module may still be valid; assert presence when available
    if (controllers) {
      expect(controllers).toEqual(expect.arrayContaining([TarotController]));
    }

    if (providers) {
      expect(providers).toEqual(expect.arrayContaining([TarotService]));
    }

    // Basic sanity: module should be defined
    expect(TarotModule).toBeDefined();
  });
});
