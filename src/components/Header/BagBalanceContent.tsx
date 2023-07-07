import { /* ChainId, */ TokenAmount, WAVAX, JSBI } from 'dogeshrek-sdk'
import React /*,  { useState, useEffect } */ from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/images/token-logo.png'
import { BAG } from '../../constants'
//import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useAggregateBagBalance, useTokenBalance } from '../../state/wallet/hooks'
import { TYPE, BagTokenAnimated } from '../../theme'
//import { computeBagCirculation } from '../../utils/computeBagCirculation'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../pool/styled'
import { usePair } from '../../data/Reserves'

const ContentWrapper = styled(AutoColumn)`
   width: 100%;
 `

const ModalUpper = styled(DataCard)`
   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
   background: radial-gradient(76.02% 75.41% at 1.84% 0%, #E8C177 0%, #38163A 100%);
   padding: 0.5rem;
 `

const StyledClose = styled(X)`
   position: absolute;
   right: 16px;
   top: 16px;

   :hover {
     cursor: pointer;
   }
 `

/**
 * Content for balance stats modal
 */
export default function BagBalanceContent({ setShowBagBalanceModal }: { setShowBagBalanceModal: any }) {
	const { account, chainId } = useActiveWeb3React()
	//const [circulatingSupply, setCirculatingSupply] = useState<TokenAmount>()
	const bag = chainId ? BAG[chainId] : undefined

	const total = useAggregateBagBalance()
	const bagBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, bag)
/*
	const totalSupply: TokenAmount | undefined = useTotalSupply(bag)

	useEffect(() => {
		bag && chainId === ChainId.DOGECHAIN
			? computeBagCirculation(bag)
				.then(circulating => {
					setCirculatingSupply(circulating)
				})
			: setCirculatingSupply(totalSupply)
	}, [bag, chainId, totalSupply])

	*/

	//Determine BAG price in AVAX
	const wavax = WAVAX[chainId ? chainId : 2000]
	const [, avaxBagTokenPair] = usePair(wavax, bag)
	const oneToken = JSBI.BigInt(1000000000000000000)
	let bagPrice: Number | undefined
	if (avaxBagTokenPair && bag) {
		const avaxBagRatio = JSBI.divide(JSBI.multiply(oneToken, avaxBagTokenPair.reserveOf(wavax).raw),
										 avaxBagTokenPair.reserveOf(bag).raw)
		bagPrice = JSBI.toNumber(avaxBagRatio) / 1000000000000000000
	}

	return (
		<ContentWrapper gap="lg">
			<ModalUpper>
				<CardBGImage />
				<CardNoise />
				<CardSection gap="md">
					<RowBetween>
						<TYPE.white color="white">Your DogeShrek Breakdown</TYPE.white>
						<StyledClose stroke="white" onClick={() => setShowBagBalanceModal(false)} />
					</RowBetween>
				</CardSection>
				<Break />
				{account && (
					<>
						<CardSection gap="sm">
							<AutoColumn gap="md" justify="center">
								<BagTokenAnimated width="48px" src={tokenLogo} />{' '}
								<TYPE.white fontSize={48} fontWeight={600} color="white">
									{total?.toFixed(2, { groupSeparator: ',' })}
								</TYPE.white>
							</AutoColumn>
							<AutoColumn gap="md">
								<RowBetween>
									<TYPE.white color="white">Balance:</TYPE.white>
									<TYPE.white color="white">{bagBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
								</RowBetween>
							</AutoColumn>
						</CardSection>
						<Break />
					</>
				)}
				<CardSection gap="sm">
					<AutoColumn gap="md">
						<RowBetween>
							<TYPE.white color="white">DogeShrek price:</TYPE.white>
							<TYPE.white color="white">{bagPrice?.toFixed(5) ?? '-'} DOGE</TYPE.white>
						</RowBetween>
						
						<RowBetween>
							

						</RowBetween>

						<RowBetween>
							<TYPE.white color="white">DogeShrek Analytics:</TYPE.white>
							<TYPE.white color="white"><a style={ { color: "limegreen"} } target="_blank" href="https://dexscreener.com/dogechain/0xd4f2e4107cc48296d25bc656bf9039fb3f406d79" >here</a></TYPE.white>
						</RowBetween>
					</AutoColumn>
				</CardSection>
			</ModalUpper>
		</ContentWrapper>
	)
}
/*
							<TYPE.white color="white">Total Supply  </TYPE.white>
							<TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>

							<TYPE.white color="white">DogeShrek in circulation:</TYPE.white>
							<TYPE.white color="white">{circulatingSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>

*/