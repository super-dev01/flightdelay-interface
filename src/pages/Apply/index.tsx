import React, { useCallback } from 'react'
import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../AppBody'
import { useTranslation } from 'react-i18next'
import FlightInputPanel from '../../components/FlightInputPanel'
import FlightDetailsPanel from '../../components/FlightDetailsPanel'
import QuoteDetailsPanel from '../../components/QuoteDetailsPanel'
import { useApplyActionHandlers, useApplyState } from '../../state/apply/hooks'

import { Carrier } from '../../entities/carrier'
import { Moment } from 'moment'
import styled from 'styled-components'
import Logo from '../../assets/images/2020_Etherisc_FlightDelayProtection.svg'
import { isDefinedFlight } from '../../entities/flight'
import { useFlightDetailsState } from '../../state/flightDetails/hooks'

const Wrapper = styled.div`
  position: relative;
`

const BottomGrouping = styled.div`
  margin-top: 1rem;
`

const DialogTitle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
`
export default function Apply() {
  const { t } = useTranslation()
  const flightDetails = useFlightDetailsState()

  const { account } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // apply state
  const { flight } = useApplyState()

  const { onCarrierSelection, onFlightNumberInput, onDepartureInput } = useApplyActionHandlers()

  const handleCarrierSelect = useCallback(
    (value: Carrier) => {
      onCarrierSelection(value)
    },
    [onCarrierSelection]
  )

  const handleFlightNumberInput = useCallback(
    (value: string) => {
      onFlightNumberInput(value)
    },
    [onFlightNumberInput]
  )

  const handleDepartureInput = useCallback(
    (value: Moment | null) => {
      onDepartureInput(value)
    },
    [onDepartureInput]
  )

  const showFlightDetails = isDefinedFlight(flight)
  const showQuote = isDefinedFlight(flight) && flightDetails.hasFlights

  return (
    <>
      <AppBody>
        <Wrapper id="apply-page">
          {/* see https://github.com/Uniswap/uniswap-interface/blob/2291e3ec2015a1967d56e420d4e68ec1fd4e97db/src/pages/Swap/index.tsx#L305
          <ConfirmPurchaseModal></ConfirmPurchaseModal>
          */}
          <AutoColumn gap={'md'}>
            <DialogTitle>
              <img width={'400px'} src={Logo} alt="logo" />
            </DialogTitle>
            <FlightInputPanel
              flight={flight}
              onCarrierSelect={handleCarrierSelect}
              onFlightNumberInput={handleFlightNumberInput}
              onDepartureInput={handleDepartureInput}
              id="carrier-select-input"
            />
            {showFlightDetails ? <FlightDetailsPanel id="flight-details-input-2" /> : null}
            {showQuote ? <QuoteDetailsPanel id="flight-details-input-2" /> : null}
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
            ) : (
              // https://github.com/Uniswap/uniswap-interface/blob/master/src/pages/Swap/index.tsx line 440 ff.
              <ButtonError disabled={!showQuote} onClick={toggleWalletModal}>{t('fdd.applyForPolicy')}</ButtonError>
            )}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
    </>
  )
}
