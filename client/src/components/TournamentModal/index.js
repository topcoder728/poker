import React, { useContext } from "react";
import styled from "styled-components";
import globalContext from "../../context/global/globalContext";
import GradientButton from "../GradientButton";
import modalContext from "../../context/modal/modalContext";
import pokerClient from "../../helpers/axios";

const ModalContainer = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  transition: all 0.3s;
  color: #fff;
  text-align: center;

  & .modal {
    display: flex;
    flex-direction: column;
    width: 340px;
    height: 253px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 32px 12px;
    border-radius: 12px;
    background: #333541;

    .title {
      color: rgba(255, 255, 255, 0.67);
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      text-transform: uppercase;
    }

    .sub-title {
      text-transform: uppercase;
      color: #da367f;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
    }

    .contents {
      display: flex;
      flex-direction: column;
      margin-top: 30px;
      .row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 400;
        line-height: 15.6px;

        .field {
          color: #9e9c9c;
        }

        .value {
          color: #ffffff;
        }
      }

      .button-group {
        margin-top: 30px;
      }
    }
  }
`;

const CancelButton = styled.button`
  width: 147px;
  height: 42px;
  border-radius: 8px;
  text-align: center;
  border: solid 1px #fff;
  font-family: IBM Plex Mono;
  font-size: 13px;
  font-weight: 500;
  line-height: 16.9px;
  color: #fff;
  cursor: pointer;
  background: transparent;
`;

const TournamentModal = () => {
  const {
    setOpenTournamentModal,
    setActiveTab,
    tnTables,
    isLoading,
    chipsAmount,
    setBalance,
    setChipsAmount,
    setIsLoading,
    nativeToken,
  } = useContext(globalContext);
  const { openModal, closeModal } = useContext(modalContext);

  const showFreeChipsModal = () => {
    openModal(
      () => (
        <span>
          For the Register to Tournament, you should get the chips by 30 USD of
          your Balance.
        </span>
      ),
      ``,
      `OK`,
      handleFreeChipsRequest
    );
  };

  const handleFreeChipsRequest = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.token;
      const res = await pokerClient.get("/api/chips/free", {
        headers: {
          "x-auth-token": token,
        },
      });
      if (res.data.errors) {
        console.log(res.data.errors);
      } else {
        const { chipsAmount, balance } = res.data;
        setBalance(
          balance.data.find((coin) => coin.coinType === nativeToken).balance
        );
        setChipsAmount(chipsAmount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
    }
    setIsLoading(false);
  };

  return (
    <ModalContainer>
      <div className="modal">
        <span className="title">registration for tournament?</span>
        <span className="sub-title">rinomaha</span>
        <div className="contents">
          <div className="row">
            <span className="field">Start time:</span>
            <span className="value">Jun 14 @ 5:59 PM</span>
          </div>
          <div className="row">
            <span className="field">Your Available Balance:</span>
            <span className="value">0$</span>
          </div>
          <div className="row">
            <span className="field">Buy in:</span>
            <span className="value">Free roll</span>
          </div>
          <div className="row button-group">
            <CancelButton onClick={() => setOpenTournamentModal(false)}>
              Cancel
            </CancelButton>
            <GradientButton
              width="147px"
              height="42px"
              radius="8px"
              onClick={() => {
                showFreeChipsModal();
                setOpenTournamentModal(false);
              }}
            >
              Register
            </GradientButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default TournamentModal;