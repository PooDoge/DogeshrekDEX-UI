import { ChainId } from '@baguette-exchange/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: '0xb465Fd2d9C71d5D6e6c069aaC9b4E21c69aAA78f',
  [ChainId.AVALANCHE]: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
  [ChainId.DOGECHAIN]: '0xc920E13570D9D5058e69Da46Ada32Bc188996d78'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
