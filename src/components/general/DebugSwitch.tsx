import { FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_DEBUG_SWITCH } from "../../state/reducers";
import { RootState } from "../../state/store";

interface DebugSwitchProps {
  stateAttribute: string; // TODO: limit type to property of DebuSwitchesState
  label: string;
}

const DebugSwitch = ({ stateAttribute }: DebugSwitchProps) => {
  const localStorageItemExists = localStorage.getItem(stateAttribute) !== null;
  const dispatch = useDispatch();
  const dispatchSetDebugSwitch = (value: boolean) => {
    dispatch({
      type: SET_DEBUG_SWITCH,
      value,
      switchName: stateAttribute, // TODO: why there is no type-check on dispatched action attributes ?
    });
  };

  useEffect(() => {
    if (localStorageItemExists) dispatchSetDebugSwitch(true);
    // eslint-disable-next-line
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    dispatchSetDebugSwitch(checked);

    if (checked) localStorage.setItem(stateAttribute, "");
    else localStorage.removeItem(stateAttribute);
  };

  const debugSwitchIsOn = useSelector(
    (state: RootState) => state.debugSwitches[stateAttribute]
  );

  return (
    <FormControlLabel
      control={
        <Switch
          checked={debugSwitchIsOn}
          onChange={handleChange}
          size="small"
        />
      }
      label={stateAttribute}
      labelPlacement="start"
    />
  );
};

export default DebugSwitch;
