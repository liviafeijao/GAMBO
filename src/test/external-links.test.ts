import {describe, expect, it} from 'vitest';
import {TELEGRAM_BOT_URL} from '@/lib/external-links';

describe('Telegram bot link', () => {
  it('opens the GAMBO bot on Telegram', () => {
    expect(TELEGRAM_BOT_URL).toBe('https://t.me/Gambo1_bot');
  });
});
