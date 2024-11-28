import React, { useEffect, useState } from 'react';
import './provider.css';
import VendorGameListHeader from './VendorGameListHeader';
import CardContent from "@mui/material/CardContent";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Card from "@mui/material/Card";
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import APIService from 'src/app/services/APIService';
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import { locale } from "../../../../configs/navigation-i18n";
import { useSelector } from "react-redux";

function VendorGameListApp() {
  const [vendorList, setVendorList] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [showkr, setShowKR] = useState(false)

  useEffect(() => {
    if (selectLocale === "ko") {
      setSelectedLang(locale.ko);
      setShowKR(true)
    } else {
      setSelectedLang(locale.en);
      setShowKR(false)
    }
  }, [selectLocale]);


  useEffect(() => {
    fetchProvider();
  }, []);

  const fetchProvider = () => {
    setLoaded(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/vendor-list`,
      method: 'GET',
    })
      .then((res) => {

        setVendorList(res.data.data);
        setLoaded(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoaded(false);
      });
  };

  return (
    <>
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<VendorGameListHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <CardContent>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}
                >
                  <TableContainer component={Paper} style={{ overflowX: 'auto', borderRadius: 0 }} className='table-container'>
                    <Table style={{ minWidth: 650, borderRadius: 0 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{width:"150px"}}>{selectedLang.VENDORID}</TableCell>
                          <TableCell style={{width:"150px", textAlign:"center"}}>{selectedLang.VENDORNAME}</TableCell>
                          <TableCell style={{width:"150px", textAlign:"center"}}>{selectedLang.GAMETYPE}</TableCell>
                          <TableCell style={{width:"150px", textAlign:"center"}}>{selectedLang.TYPE}</TableCell>
                          <TableCell style={{width:"150px", textAlign:"center"}}>{selectedLang.status}</TableCell>
                          <TableCell style={{width:"150px", textAlign:"center"}}>{selectedLang.GAMELIST}</TableCell>
                          <TableCell style={{width:"150px", textAlign:"center"}}>{selectedLang.LOBBYLIST}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {vendorList &&
                          vendorList.map((vendor) => (
                            <TableRow key={vendor._id}>
                              <TableCell>{vendor.vendor_id}</TableCell>
                              {showkr ? (<TableCell className='text-center'>{(vendor.vendor_name_kr)}</TableCell>) : (<TableCell className='text-center'>{(vendor.vendor_name)}</TableCell>)}
                              {/* <TableCell>{(vendor.vendor_name)}</TableCell>
                                <TableCell>{(vendor.vendor_name_kr)}</TableCell> */}
                                <TableCell className='text-center'> {vendor.game_type == null ? "" : vendor.game_type.charAt(0).toUpperCase() + vendor.game_type.slice(1) }</TableCell>
                              <TableCell className='text-center max-width-500'>{vendor.type.join(', ')}</TableCell>
                              <TableCell className='text-center' style={{ color: vendor.status ? '#35cdd9' : 'red', fontWeight: vendor.status ? 'bold' : 'normal' }}>
                                {vendor.status.toString()}
                              </TableCell>
                              <TableCell className='text-center' style={{ color: vendor.game_list ? '#35cdd9' : 'red', fontWeight: vendor.game_list ? 'bold' : 'normal' }}>
                                {vendor.game_list.toString()}
                              </TableCell>
                              <TableCell className='text-center' style={{ color: vendor.lobby_list ? '#35cdd9' : 'red', fontWeight: vendor.lobby_list ? 'bold' : 'normal' }}>
                                {vendor.lobby_list.toString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </CardContent>
            </Card>
          }
        />
      )}
    </>
  );
}

export default VendorGameListApp;