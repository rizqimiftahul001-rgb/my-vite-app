import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import ServiceDeskHeader from "./serviceDeskHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";

function serviceDeskApp() {
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  return (
    <FusePageSimple
      header={<ServiceDeskHeader selectedLang={selectedLang} />}
      content={<></>}
    />
  );
}

export default serviceDeskApp;
