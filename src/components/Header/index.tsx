import { ChainId, TokenAmount } from 'dogeshrek-sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/svg/icon.svg'
import LogoDark from '../../assets/svg/icon.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances, useAggregateBagBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../pool/styled'
import { CountUp } from 'use-count-up'
import { TYPE, ExternalLink } from '../../theme'

import { RedCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import Modal from '../Modal'
import BagBalanceContent from './BagBalanceContent'


import ChainListModal from './ChainListModal'




import usePrevious from '../../hooks/usePrevious'
import { EXTERNAL_FARM_PAGE, BRIDGE_PAGE } from '../../constants'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`

const BAGAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #E8C177 0%, #06410b 100%), #edeef2;

`

const BAGWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(RedCard)`
  border-radius: 12px;
  padding: 8px 12px;
  color:tan;
  cursor:pointer;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const BagIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`

const StyledDefaultExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'Fuji',
  [ChainId.AVALANCHE]: 'AVALANCHE',
  [ChainId.DOGECHAIN]: 'Dogechain',


}


const NETWORK_Logo_URL: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'https://raw.githubusercontent.com/PooDoge/dogeshrek-tokenlist/main/tokens/wshib.png',
  [ChainId.AVALANCHE]: 'https://raw.githubusercontent.com/PooDoge/dogeshrek-tokenlist/main/tokens/wshib.png',
  [ChainId.DOGECHAIN]: 'https://raw.githubusercontent.com/PooDoge/dogeshrek-tokenlist/main/tokens/wdoge.png',
}


export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  const aggregateBalance: TokenAmount | undefined = useAggregateBagBalance()

  const [showBagBalanceModal, setShowBagBalanceModal] = useState(false)

  const [showChainModal, setShowChainModal] = useState(false)




  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame>


       <Modal isOpen={showChainModal} onDismiss={() => setShowChainModal(false)}>
        <ChainListModal setShowBagBalanceModal={setShowChainModal} />
      </Modal>



      <Modal isOpen={showBagBalanceModal} onDismiss={() => setShowBagBalanceModal(false)}>
        <BagBalanceContent setShowBagBalanceModal={setShowBagBalanceModal} />
      </Modal>
      
      <HeaderRow>
        <Title href=".">
          <BagIcon>
            <img width={'24px'} src={isDark ? LogoDark : Logo} alt="logo" />
          </BagIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            {t('swap')}
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            {t('pool')}
          </StyledNavLink>


         


          <StyledDefaultExternalLink id={`info-nav-link`} href={EXTERNAL_FARM_PAGE}>
            Farms  <span style={{ fontSize: '11px' }}>↗</span>
          </StyledDefaultExternalLink>

          <StyledExternalLink id={`info-nav-link`} href={BRIDGE_PAGE}>
            Bridge  <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>


        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (

              // reactive to have model
              //<NetworkCard onClick={() => setShowChainModal(true)} title={NETWORK_LABELS[chainId]}><img src={NETWORK_Logo_URL[chainId]} width="25"></img></NetworkCard>

              <NetworkCard onClick={() => setShowChainModal(false)} title={NETWORK_LABELS[chainId]}><img src={NETWORK_Logo_URL[chainId]} width="25"></img></NetworkCard>

            )}
          </HideSmall>
          {aggregateBalance && (
            <BAGWrapper onClick={() => setShowBagBalanceModal(true)}>
              <BAGAmount active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                )}
                DogeShrek
              </BAGAmount>
              <CardNoise />
            </BAGWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} DOGE
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
/*


          <StyledNavLink id={`stake-nav-link`} to={'/oven'}>
            Stake
          </StyledNavLink>
          <StyledExternalLink id={`info-nav-link`} href={ANALYTICS_PAGE}>
            Analytics <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>
*/
/* 


          <StyledExternalLink id={`info-nav-link`} href={EXTERNAL_FARM_PAGE}>
              DogeCorn beta farms  <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>


*/