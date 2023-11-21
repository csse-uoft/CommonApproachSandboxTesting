import React, {useEffect, useState, useContext} from 'react';
import {Autocomplete, CircularProgress, Grid, Paper, TextField, Typography} from "@mui/material";
import {createFilterOptions} from '@mui/material/Autocomplete';
import {fetchOrganizationsInterfaces} from "../../api/organizationApi";
import {UserContext} from "../../context";
import {useSnackbar} from "notistack";
import {fetchOutcomeInterfaces, fetchOutcomes} from '../../api/outcomeApi';
import GeneralField from "./fields/GeneralField";
import {reportErrorToBackend} from "../../api/errorReportApi";
import {isValidURL} from "../../helpers/validation_helpers";
import {fetchStakeholderOutcomeInterface} from "../../api/stakeholderOutcomeAPI";
import {fetchIndicatorInterfaces} from "../../api/indicatorApi";
import {fetchHowMuchImpacts} from "../../api/howMuchImpactApi";
import {fetchImpactRisks} from "../../api/impactRiskApi";
import Dropdown from "./fields/MultiSelectField";


const filterOptions = createFilterOptions({
  ignoreAccents: false,
  matchFrom: 'start'
});


function LoadingAutoComplete({
                               label,
                               options,
                               state,
                               onChange,
                               disabled,
                               error,
                               helperText,
                               required,
                               onBlur
                             }) {
  return (
    <Autocomplete
      sx={{mt: 2}}
      options={Object.keys(options)}
      getOptionLabel={(key) => options[key]}
      fullWidth
      value={state}
      onChange={onChange}
      disabled={disabled}
      filterOptions={filterOptions}
      renderInput={(params) =>
        <TextField
          {...params}
          required={required}
          label={label}
          disabled={disabled}
          error={error}
          helperText={helperText}
          onBlur={onBlur}
        />
      }
    />
  );
}

export default function ImpactReportField({defaultValue, required, onChange, label, disabled, importErrors, disabledOrganization, uriDiasbled}) {

  const [state, setState] = useState(
    defaultValue ||
    {});

  const [options, setOptions] = useState({
    organizations : {},stakeholderOutcomes: {}, indicators: {}, impactScales: {}, impactDepths: {}, impactDurations: {}
  });

  const {enqueueSnackbar} = useSnackbar();

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({...importErrors});

  const userContext = useContext(UserContext);

  useEffect(() => {
    Promise.all([fetchHowMuchImpacts('ImpactScale'), fetchHowMuchImpacts('ImpactDepth'), fetchHowMuchImpacts('ImpactDuration'), fetchImpactRisks()])
      .then(([impactScaleRet, impactDepthRet, impactDurationRet, {impactRisks}]) => {
        const impactScales = {};
        const impactDepths = {};
        const impactDurations = {};
        const impactRisksDict = {}
        if (impactScaleRet.howMuchImpacts.length) {
          impactScaleRet.howMuchImpacts.map(impactScale => {
            impactScales[impactScale._uri] = impactScale.description || impactScale._uri
          })
        }
        if (impactDepthRet.howMuchImpacts.length) {
          impactDepthRet.howMuchImpacts.map(impactDepth => {
            impactDepths[impactDepth._uri] = impactDepth.description || impactDepth._uri
          })
        }
        if (impactDurationRet.howMuchImpacts.length) {
          impactDurationRet.howMuchImpacts.map(impactDuration => {
            impactDurations[impactDuration._uri] = impactDuration.description || impactDuration._uri
          })
        }
        if (impactRisks.length) {
          impactRisks.map(impactRisk => {
            impactRisksDict[impactRisk._uri] = impactRisk.hasIdentifier || impactRisk._uri
          })
        }
        setOptions(ops => ({...ops, impactScales, impactDepths, impactDurations, impactRisks: impactRisksDict}))
      }).catch()
  }, [])


  useEffect(() => {
    fetchOrganizationsInterfaces().then(({success, organizations}) => {
      if (success) {
        const options = {};
        organizations.map(organization => {
          // only organization which the user serves as an editor should be able to add
          options[organization._uri] = organization.legalName;
        });
        setOptions(op => ({...op, organization: options}));
        setLoading(false);
      }
    }).catch(e => {
      if (e.json) {
        setErrors(e.json);
      }
      reportErrorToBackend(e)
      console.log(e);
      enqueueSnackbar(e.json?.message || 'Error occurs when fetching organizations', {variant: "error"});
      setLoading(false);
    });

  }, []);

  useEffect(() => {
    if (state.organization) {
      fetchStakeholderOutcomeInterface(encodeURIComponent(state.organization)).then(({stakeholderOutcomeInterfaces}) => {
        console.log(stakeholderOutcomeInterfaces)
        setOptions(ops => ({...ops, stakeholderOutcomes: stakeholderOutcomeInterfaces}))
      }).catch(e => {
        if (e.json) {
          setErrors(e.json);
        }
        reportErrorToBackend(e)
        console.log(e);
        enqueueSnackbar(e.json?.message || 'Error occurs when fetching outcomes', {variant: "error"});
      })
    }

  }, [state.organization])

  useEffect(() => {
    if (state.organization) {
      fetchIndicatorInterfaces(encodeURIComponent(state.organization)).then(({indicatorInterfaces}) => {
        setOptions(ops => ({...ops, indicators: indicatorInterfaces}))
      }).catch(e => {
        if (e.json) {
          setErrors(e.json);
        }
        reportErrorToBackend(e)
        console.log(e);
        enqueueSnackbar(e.json?.message || 'Error occurs when fetching indicators', {variant: "error"});
      })
    }

  }, [state.organization])

  useEffect(() => {
    setErrors({...importErrors});
  }, [importErrors]);

  const handleChange = name => (e, value) => {
    if(name !== 'outcome') {
      setState(state => {
        state[name] = value ?? e.target.value;
        return state;
      });
    } else {
      setState(state => {
        state.outcome = value;
        state.unitOfMeasure = outcomes[value]?.unitOfMeasure?.label;
        return state
      });
    }
    // state[name] = value ?? e.target.value;
    onChange(state);
  };

  return (
    <Paper variant="outlined" sx={{mt: 3, mb: 3, p: 2.5, borderRadius: 2}}>
      <Typography variant="h5">
        {loading && <CircularProgress color="inherit" size={20}/>} {label}
      </Typography>
      {!loading &&
        <>
          <Grid container columnSpacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={{mt: 2}}
                fullWidth
                label="Name"
                type="text"
                defaultValue={state.name}
                onChange={handleChange('name')}
                disabled={disabled}
                required={required}
                error={!!errors.name}
                helperText={errors.name}
                onBlur={() => {
                  if (!state.name) {
                    setErrors(errors => ({...errors, name: 'This field cannot be empty'}));
                  } else {
                    setErrors(errors => ({...errors, name: null}));
                  }
                }
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{mt: 2}}
                fullWidth
                label="URI"
                type="text"
                defaultValue={state.uri}
                onChange={handleChange('uri')}
                disabled={disabled}
                required={required}
                error={!!errors.uri}
                helperText={errors.uri}
                onBlur={() => {
                  if (!state.uri) {
                    setErrors(errors => ({...errors, uri: 'This field cannot be empty'}));
                  } else {
                    setErrors(errors => ({...errors, uri: null}));
                  }
                }
                }
              />
            </Grid>

            
            <Grid item xs={4}>
              <LoadingAutoComplete
                label="Organization"
                options={options.organization}
                state={state.organization}
                onChange={handleChange('organization')}
                error={!!errors.organization}
                helperText={errors.organization}
                required={required}
                disabled={disabled || disabledOrganization}
                onBlur={() => {
                  if (!state.organization) {
                    setErrors(errors => ({...errors, organization: 'This field cannot be empty'}));
                  } else {
                    setErrors(errors => ({...errors, organization: null}));
                  }
                }
                }
              />
            </Grid>
            <Grid item xs={4}>
              <LoadingAutoComplete
                label={"Stakeholder Outcome"}
                disabled={disabled}
                options={options.stakeholderOutcomes}
                state={state.forStakeholderOutcome}
                onChange={
                  handleChange('forStakeholderOutcome')
                }
                error={!!errors.forStakeholderOutcome}
                helperText={errors.forStakeholderOutcome}
                required={required}
                onBlur={() => {
                  if (state.forStakeholderOutcome) {
                    setErrors(errors => ({...errors, forStakeholderOutcome: null}));
                  }
                }
                }
              />
            </Grid>

            <Grid item xs={4}>
              <LoadingAutoComplete
                label={"Impact Scale"}
                options={options.impactScales}
                state={state.impactScale}
                onChange={
                  handleChange('impactScale')
                }
                error={!!errors.impactScale}
                helperText={errors.impactScale}
                required={required}
                onBlur={() => {
                  if (state.impactScale) {
                    setErrors(errors => ({...errors, impactScale: null}));
                  }
                }
                }
              />
            </Grid>

            <Grid item xs={4}>
              <LoadingAutoComplete
                label={"Impact Depth"}
                options={options.impactDepths}
                state={state.impactDepth}
                onChange={
                  handleChange('impactDepth')
                }
                error={!!errors.impactDepth}
                helperText={errors.impactDepth}
                required={required}
                onBlur={() => {
                  if (state.impactDepth) {
                    setErrors(errors => ({...errors, impactDepth: null}));
                  }
                }
                }
              />
            </Grid>

            <Grid item xs={4}>
              <LoadingAutoComplete
                sx={{mt: 2}}
                label={"Impact Duration"}
                options={options.impactDurations}
                state={state.impactDuration}
                onChange={handleChange('impactDuration')}
                required={required}
                error={!!errors.impactDuration}
                helperText={errors.impactDuration}
                onBlur={() => {
                  if (state.impactDuration) {
                    setErrors(errors => ({...errors, impactDuration: null}));
                  }
                }
                }
              />
            </Grid>

            <Grid item xs={4}>
              <LoadingAutoComplete
                label="Reported Impact"
                options={{"positive": "positive", "negative": "negative", "neutral": "neutral"}}
                onChange={handleChange('reportedImpact')}
                value={state.reportedImpact}
                required={required}
                disabled={disabled}
              />
            </Grid>

        
            <Grid item xs={3}>
              <GeneralField
                fullWidth
                type={'datetime'}
                value={state.startTime}
                label={'Start Time'}
                minWidth={187}
                onChange={handleChange('startTime')}
                required={required}
                disabled={disabled}
                error={!!errors.startTime}
                helperText={errors.startTime}
                // onBlur={() => {
                //   if (!state.startTime) {
                //     setErrors(errors => ({...errors, startTime: 'This field cannot be empty'}));
                //   } else {
                //     setErrors(errors => ({...errors, startTime: null}));
                //   }
                // }
                // }
              />
            </Grid>

            <Grid item xs={3}>
              <GeneralField
                fullWidth
                type={'datetime'}
                value={state.endTime}
                label={'End Time'}
                minWidth={187}
                onChange={handleChange('endTime')}
                required={required}
                disabled={disabled}
                error={!!errors.endTime}
                helperText={errors.endTime}
                // onBlur={() => {
                //   if (!state.endTime) {
                //     setErrors(errors => ({...errors, endTime: 'This field cannot be empty'}));
                //   } else {
                //     setErrors(errors => ({...errors, endTime: null}));
                //   }
                // }
                // }
              />
            </Grid>
            <Grid item xs={6}>
              <Dropdown
                sx={{mt: 2}}
                label={"Impact Risk"}
                options={options.impactRisks}
                state={state.impactRisk}
                onChange={(e) => {
                  setState(state => ({...state, impactRisks: e.target.value}));
                  const st = state;
                  st.impactRisks = e.target.value;
                  onChange(st);
                }
                }
                error={!!errors.impactRisks}
                helperText={errors.impactRisks}
              />


              
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                sx={{mt: 2}}
                label="Expectation"
                type="text"
                defaultValue={state.expectation}
                onChange={handleChange('expectation')}
                required={required}
                disabled={disabled}
                error={!!errors.expectation}
                helperText={errors.expectation}
                multiline
                minRows={4}

              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{mt: 2}}
                fullWidth
                label="Comment"
                type="text"
                defaultValue={state.comment}
                onChange={handleChange('comment')}
                required={required}
                disabled={disabled}
                error={!!errors.comment}
                helperText={errors.comment}
                multiline
                minRows={5}
                onBlur={() => {
                  if (!state.comment) {
                    setErrors(errors => ({...errors, comment: 'This field cannot be empty'}));
                  } else {
                    setErrors(errors => ({...errors, comment: null}));
                  }
                }
                }
              />
            </Grid>


          </Grid>
        </>
      }
    </Paper>
  );
}
