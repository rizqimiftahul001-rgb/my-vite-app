import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Container } from "@mui/material";
import "./DetailsHistory.css";
import APIService from "src/app/services/APIService";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { locale } from "../../../configs/navigation-i18n";
import DataHandler from "src/app/handlers/DataHandler";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import CasinoCard from "../user/bet-history/casinoCard";
import { formatLocalDateTime, formatSentence } from "src/app/services/Utility";
import { useParams } from "react-router-dom";

function DetailsHistoryApp() {
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const user_id = DataHandler.getFromSession("user_id");
  const [role, setRole] = useState(jwtDecode(DataHandler.getFromSession("accessToken"))["data"]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [detailhistory, setDetailHistory] = useState(null);
  const {casino_user } = useParams();

  const ids = useParams()



  const bet_transaction_id = ids.bet_transaction_id
  const result_transaction_id = ids.result_transaction_id
  const provider_id = ids.provider_id

  if (!bet_transaction_id || !result_transaction_id) {
    return (
      <FusePageSimple
        content={
          <Card sx={{ width: "100%", borderRadius: "4px" }} className="main_card">
            <Container maxWidth="md" className="bet-details-container">
              <div className="container">
                <center>No Data Available</center>
              </div>
            </Container>
          </Card>
        }
      />
    );
  }

  const viewBetClick = (bet_transaction_id, result_transaction_id) => {
    setLoading(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/get-one-history?bet_transaction_id=${bet_transaction_id}&result_transaction_id=${result_transaction_id}`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res);
        setDetailHistory(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang[`${formatSentence(err?.message)}`] || selectedLang.something_went_wrong}`,
          })
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    viewBetClick(bet_transaction_id,result_transaction_id);
  }, [bet_transaction_id,result_transaction_id]);

  if (loading) {
    return <FuseLoading />;
  }

  const betData = detailhistory?.[0]?.extra_history?.data || {};
  const playerData = betData?.participants?.[0] || {};
  const playerBets = playerData?.bets || [];

  return (
    <FusePageSimple
      content={
        <Card sx={{ width: "100%", borderRadius: "4px" }} className="main_card">
          <Container maxWidth="md" className="bet-details-container">
            {
              provider_id === "18"
              ?
              <div className="container">
               { detailhistory && (
              <div style={{border:"1px solid #d2a24c",padding:"10px"}}>
              <h4><strong>Bet Details</strong></h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p><strong>Game Type:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{detailhistory?.[0].extra_history.data.gameType}</p>
                  <p><strong>Game Started Time:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{detailhistory[0].extra_history.data.startedAt}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p><strong>Status:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{detailhistory[0].extra_history.data.status}</p>
                  <p><strong>Time to Complete the Game:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{detailhistory[0].extra_history.data.settledAt}</p>
                </div>
              </div>
            )}
              <div className="section">
                <br/><br/>
                <h4><strong>Betting Info</strong></h4>
                <br/>
                <table>
                  <thead>
                    <tr>
                      <th>BET</th>
                      <th>BET AMOUNT</th>
                      <th>PAYMENT AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailhistory && (
                      <tr>
                        <td>{betData.bets[0]?.bet}</td>
                        <td>{betData.bets[0]?.stake}</td>
                        <td>{betData.bets[0]?.payout}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{border:"1px solid #d2a24c",padding:"10px"}}>
              <h4> <strong>Game Summary</strong></h4>
              <br/>
               { detailhistory && (
              <>
                <div style={{marginBottom: '8px' }}>
                  <p><strong>Total Stake:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{betData.bet?.betAmount}</p>
                  <p><strong>Total Payment:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{betData.bet?.winAmount}</p>
                  <p><strong>Total DrawAmount:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{betData.bet?.drawAmount}</p>
                </div>
              </>)}
              </div>
              <br/>
              <div className="section">
                <h4><strong>Game Result</strong></h4>
                <table>
                  <thead>
                    <tr>
                      {/* <th></th> */}
                      <th>PLAYER</th>
                      <th>BANKER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailhistory && (
                      <tr>
                        {/* <td>
                          <div className="score-details">
                            <div>Score</div>
                            <div>Card</div>
                            <div>Outcome</div>
                            <div>SideBet Outcome</div>
                          </div>
                        </td> */}
                        <td>
                          <div className="cards">
                          {(betData.result?.player?.cards.length > 0 ? 
                            betData.result.player.cards : 
                            betData.result?.Player?.cards?.length > 0 ? 
                            betData.result.Player.cards : 
                            []
                          )?.map((card, index) => (
                            <CasinoCard
                              key={index}
                              card={card}
                              index={index}
                              result={betData.result?.player?.cards.length > 0 ? "player" : "Player"}
                              rotate={true}
                            />
                          ))}
                          </div>
                          <div className="cards">
                            <div><strong>Score:&nbsp;&nbsp;{(betData.result?.player?.score || betData.result?.Player?.score)}</strong></div>
                          </div>
                        </td>
                        <td>
                          <div className="cards">
                          {(betData.result?.banker?.cards.length > 0 ? 
                            betData.result.banker.cards : 
                            betData.result?.Banker?.cards?.length > 0 ? 
                            betData.result.Banker.cards : 
                            []
                          )?.map((card, index) => (
                            <CasinoCard
                              key={index}
                              card={card}
                              index={index}
                              result={betData.result?.banker?.cards.length > 0 ? "banker" : "Banker"}
                              rotate={true}
                            />
                          ))}
                          </div>
                          <div className="cards">
                            <div><strong>Score:&nbsp;&nbsp;{(betData.result?.banker?.score || betData.result?.Banker?.score)}</strong></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <br/>
              <center style={{border:"1px solid #d2a24c",padding:"10px"}}>
                <h4>outcomes</h4>
                <br/>
                <p>
                {Array.isArray(betData.result) && betData.result.length > 0
                  ? betData.result[0]
                  : betData.result?.outcomes?.length > 0
                  ? betData.result.outcomes[0]
                  : ""}
              </p>
              </center>
              </div>
              :
              <div className="container">
              <h1>Bet Details</h1>
              <div className="section">
                <h2>User</h2>
                <table>
                  <thead>
                    <tr>
                      <th>USER_ID</th>
                      <th>GAME_ID</th>
                      <th>GAME_TYPE</th>
                      <th>REG_DATE(KST)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailhistory && (
                      <tr>
                        <td>{casino_user}</td>
                        <td>{betData.id}</td>
                        <td>{betData.gameType}</td>
                        <td>{detailhistory[0].transaction_timestamp}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="section">
                <h2>Table Info</h2>
                <table>
                  <thead>
                    <tr>
                      <th>TABLE_ID</th>
                      <th>TABLE_NAME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailhistory && (
                      <tr>
                        <td>{betData.table?.id}</td>
                        <td>{betData.table?.name}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="section">
                <h2>Game Result</h2>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>PLAYER</th>
                      <th>BANKER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailhistory && (
                      <tr>
                        <td>
                          <div className="score-details">
                            <div>Score</div>
                            <div>Card</div>
                            <div>Outcome</div>
                            <div>SideBet Outcome</div>
                          </div>
                        </td>
                        <td>
                          <div className="cards">
                            <div>{(betData.result?.player?.score || betData.result?.Player?.score)}</div>
                          </div>
                          <div className="cards">
                          {(betData.result?.player?.cards.length > 0 ? 
                            betData.result.player.cards : 
                            betData.result?.Player?.cards?.length > 0 ? 
                            betData.result.Player.cards : 
                            []
                          )?.map((card, index) => (
                            <CasinoCard
                              key={index}
                              card={card}
                              index={index}
                              result={betData.result?.player?.cards.length > 0 ? "player" : "Player"}
                              rotate={true}
                            />
                          ))}
                          </div>
                        </td>
                        <td>
                          <div className="cards">
                            <div>{(betData.result?.banker?.score || betData.result?.Banker?.score)}</div>
                          </div>
                          <div className="cards">
                          {(betData.result?.banker?.cards.length > 0 ? 
                            betData.result.banker.cards : 
                            betData.result?.Banker?.cards?.length > 0 ? 
                            betData.result.Banker.cards : 
                            []
                          )?.map((card, index) => (
                            <CasinoCard
                              key={index}
                              card={card}
                              index={index}
                              result={betData.result?.banker?.cards.length > 0 ? "banker" : "Banker"}
                              rotate={true}
                            />
                          ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="section">
                <h2>Bets</h2>
                <table>
                  <thead>
                    <tr>
                      <th>BET_SPOT</th>
                      <th>BET_AMOUNT</th>
                      <th>WIN_AMOUNT</th>
                      <th>PUSH_AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerBets.map((bet, index) => (
                      <tr key={index}>
                        <td>{bet.code}</td>
                        <td>{bet.stake}</td>
                        <td>{bet.payout}</td>
                        <td>{bet.push_amount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            }
          </Container>
        </Card>
      }
    />
  );
}

export default DetailsHistoryApp;
