import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Container } from "@mui/material";
import "./PublicDetailsHistory.css";
import APIService from "src/app/services/APIService";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { locale } from "../../../configs/navigation-i18n";
import Box from "@mui/material/Box";
import { formatSentence } from "src/app/services/Utility";
import { useParams } from "react-router-dom";

function PublicDetailsHistoryApp() {
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [detailhistory, setDetailHistory] = useState(null);

  const ids = useParams();

  const bet_transaction_id = ids.bet_transaction_id;

  if (!bet_transaction_id) {
    return (
      <FusePageSimple
        content={
          <Card
            sx={{ width: "100%", borderRadius: "4px" }}
            className="main_card"
          >
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

  const viewBetClick = (bet_transaction_id) => {
    setLoading(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/get-one-history?bet_transaction_id=${bet_transaction_id}`,
      method: "GET",
    })
      .then((res) => {
        setDetailHistory(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${
              selectedLang[`${formatSentence(err?.message)}`] ||
              selectedLang.something_went_wrong
            }`,
          })
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    viewBetClick(bet_transaction_id);
  }, [bet_transaction_id]);

  if (loading) {
    return <FuseLoading />;
  }

  const betData = detailhistory?.[0]?.extra_history?.data || {};
  const playerData = betData?.participants?.[0] || {};
  const playerBets = playerData?.bets || [];

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    height: "80vh",
    overflow: "auto",
  };

  const shouldUseIframe = /<!DOCTYPE html>|<script[\s\S]*?>/i.test(
    detailhistory?.[0]?.extra_history?.rawHtml
  );

  return (
    <>
      {detailhistory?.[0]?.extra_history?.rawHtml !== undefined ? (
        <Box sx={modalStyle}>
          {shouldUseIframe ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <iframe
                srcDoc={detailhistory?.[0]?.extra_history?.rawHtml}
                title="Payment Result"
                style={{
                  width: "80%",
                  height: "80%",
                  border: "none",
                }}
              ></iframe>
            </Box>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: detailhistory?.[0]?.extra_history?.rawHtml,
              }}
            />
          )}
        </Box>
      ) : (
        <center>No Data Available</center>
      )}
    </>
  );
}

export default PublicDetailsHistoryApp;
