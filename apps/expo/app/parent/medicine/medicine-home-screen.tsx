import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import MedicineHomeView from "../../../src/components/medicine/medicineHome/MedicineHomeView";
import Body from "../../../src/components/Body";
import AlertModal from "../../../src/components/common/AlertModal";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";

const MedicineHome = () => {
  const [studentId, _] = useState<string | undefined>(
    useSearchParams().studentId
  );
  const [classId, __] = useState<string | undefined>(useSearchParams().classId);
  const [errorMessage, setErrorMessage] = useState("");

  if (!studentId) setErrorMessage(SYSTEM_ERROR_MESSAGE);
  return (
    <Body>
      <MedicineHomeView
        classId={classId ?? ""}
        studentId={studentId ?? ""}
        isTeacher={false}
      />
      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default MedicineHome;
