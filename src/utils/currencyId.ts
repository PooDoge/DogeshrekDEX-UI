import { Currency, CAVAX, Token } from '@baguette-exchange/sdk'

export function currencyId(currency: Currency): string {
  if (currency === CAVAX) return 'AVAX'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
