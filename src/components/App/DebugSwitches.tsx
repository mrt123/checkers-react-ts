import { FormGroup } from "@mui/material";
import DebugSwitch from "../general/DebugSwitch";

const DebugSwitches = () => {
  return (
    <FormGroup>
      <DebugSwitch stateAttribute="reduxLogs" label="redux logs" />
      <DebugSwitch
        stateAttribute="fieldsCoordinates"
        label="fields coordinates"
      />
    </FormGroup>
  );
};

export default DebugSwitches;
