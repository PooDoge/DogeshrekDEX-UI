import { Currency, CAVAX, Token, ChainId } from '@baguette-exchange/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import AvaxLogo from '../../assets/images/doge_token_round.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { BAG } from '../../constants'

const getTokenLogoURL = (address: string) =>
  address === BAG[ChainId.DOGECHAIN].address
  ? `https://raw.githubusercontent.com/dogeshrek/dogeshrektokenlist/main/tokens/dogeShrek.png`
  : `https://raw.githubusercontent.com/dogeshrek/dogeshrektokenlist/main/tokens/addresses/${address}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === CAVAX) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [...uriLocations, getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === CAVAX) {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
