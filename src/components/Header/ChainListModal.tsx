import { /* ChainId, */ WAVAX } from 'dogeshrek-sdk'
import React /*,  { useState, useEffect } */ from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import { BAG } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break,  CardNoise, CardSection, DataCard } from '../pool/styled'
import { usePair } from '../../data/Reserves'




const TextBox = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 4px 12px;
   border: 1px solid rgba(255, 255, 255, 0.4);
   width: 100%;
   justify-self: flex-end;
   cursor:pointer;


   :hover {
	transform: scaleX(1.1);
	opacity: 0.8;
   }

 `



const ContentWrapper = styled(AutoColumn)`

   width: 100%;
 `

const ModalUpper = styled(DataCard)`
   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
   background: #2c2f36;
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
	const {  chainId } = useActiveWeb3React()
	const bag = chainId ? BAG[chainId] : undefined

	const wavax = WAVAX[chainId ? chainId : 2000]
	const [ avaxBagTokenPair] = usePair(wavax, bag)
	if (avaxBagTokenPair && bag) {
	}

	return (

		// this aspect was tested but never added 
		<ContentWrapper gap="lg">
			<ModalUpper>
				<CardNoise />
				<CardSection gap="md">
					<RowBetween>
						<TYPE.white color="white">Select a Network:</TYPE.white>
						<StyledClose stroke="white" onClick={() => setShowBagBalanceModal(false)} />
					</RowBetween>
				</CardSection>
				<Break />
					<>



					
						<CardSection gap="sm">
							<AutoColumn gap="md" justify="center">
								
								<TYPE.white fontSize={18} fontWeight={600} color="white">
									<TextBox onClick={ () => window.location.href = "https://dogeshrek.com/" }>DogeChain <img style={ {marginLeft:"1rem"} }  src="https://raw.githubusercontent.com/dogeshrek/dogeshrektokenlist/main/tokens/wdoge.png" width="30" /></TextBox>

								</TYPE.white>
							</AutoColumn>
						</CardSection>


					</>
				
			
			</ModalUpper>
		</ContentWrapper>
	)
}
