import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import {Link, Loading} from "../shared";
import {Button, Container, Paper, Typography} from "@mui/material";
import LoadingButton from "../shared/LoadingButton";
import {AlertDialog} from "../shared/Dialogs";
import {useSnackbar} from "notistack";
import {UserContext} from "../../context";
import IndicatorReportField from "../shared/IndicatorReportField";
import {createIndicatorReport, fetchIndicatorReport, updateIndicatorReport} from "../../api/indicatorReportApi";
import {reportErrorToBackend} from "../../api/errorReportApi";
import {navigate, navigateHelper} from "../../helpers/navigatorHelper";
import {fetchDatasetInterfaces} from "../../api/datasetApi";
const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 0,
    length: 100
  },
}));


export default function AddEditIndicatorReport() {

  const classes = useStyles();
  const {uri, orgUri, operationMode} = useParams();
  const mode = uri ? operationMode : 'new';
  const {enqueueSnackbar} = useSnackbar();
  const navigator = useNavigate();
  const navigate = navigateHelper(navigator)
  const userContext = useContext(UserContext);

  const [datasetInterfaces, setDatasetInterfaces] = useState({});

  useEffect(() => {
    fetchDatasetInterfaces().then(({success, datasetInterfaces}) => {
      if (success){
        setDatasetInterfaces(datasetInterfaces)
      }
    }).catch(e => {
      if (e.json)
        setErrors(e.json)
      reportErrorToBackend(e)
      enqueueSnackbar(e.json?.message || "Error occur when fetching dataset interface", {variant: 'error'});
    })
  }, [])

  const [state, setState] = useState({
    submitDialog: false,
    loadingButton: false,
  });
  const [errors, setErrors] = useState(
    {}
  );

  const [form, setForm] = useState({
    name: '',
    comment: '',
    organization: null,
    indicator: null,
    numericalValue: '',
    unitOfMeasure: '',
    startTime: '',
    endTime: '',
    dateCreated: '',
    uri: '',
    hasAccesss: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((mode === 'edit' && uri) || (mode === 'view' && uri)) {
      fetchIndicatorReport(encodeURIComponent(uri)).then(({success, indicatorReport}) => {
        if (success) {
          setForm(indicatorReport);
          setLoading(false);
        }
      }).catch(e => {
        if (e.json)
          setErrors(e.json);
        reportErrorToBackend(e)
        setLoading(false);
        navigate(-1);
        enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
      });
    } else if (mode === 'edit' && (!uri || !orgUri)) {
      navigate(-1);
      enqueueSnackbar("No URI or orgUri provided", {variant: 'error'});
    } else if (mode === 'new' && !orgUri) {
      setLoading(false);
      // navigate(-1);
      // enqueueSnackbar("No orgId provided", {variant: 'error'});
    } else if (mode === 'new' && orgUri) {
      setForm(form => ({...form, organization: orgUri}));
      setLoading(false);
    } else {
      navigate(-1);
      enqueueSnackbar('Wrong auth', {variant: 'error'});
    }

  }, [mode, uri]);

  const handleSubmit = () => {
    if (validate()) {
      console.log(form);
      setState(state => ({...state, submitDialog: true}));
    }
  };

  const handleConfirm = () => {
    setState(state => ({...state, loadingButton: true}));
    if (mode === 'new') {
      createIndicatorReport({form}).then((ret) => {
        if (ret.success) {
          setState({loadingButton: false, submitDialog: false,});
          navigate(-1);
          enqueueSnackbar(ret.message || 'Success', {variant: "success"});
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json);
        }
        console.log(e);
        reportErrorToBackend(e)
        enqueueSnackbar(e.json?.message || 'Error occurs when creating indicator report', {variant: "error"});
        setState({loadingButton: false, submitDialog: false,});
      });
    } else if (mode === 'edit' && uri) {
      updateIndicatorReport(encodeURIComponent(uri),{form}).then((res) => {
        if (res.success) {
          setState({loadingButton: false, submitDialog: false,});
          enqueueSnackbar(res.message || 'Success', {variant: "success"});
          navigate(`/indicatorReports/${encodeURIComponent(form.organization)}`);
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json);
        }
        reportErrorToBackend(e)
        enqueueSnackbar(e.json?.message || 'Error occurs when updating outcome', {variant: "error"});
        setState({loadingButton: false, submitDialog: false,});
      });
    }

  };

  const validate = () => {
    const error = {};
    // if (!form.name)
    //   error.name = 'The field cannot be empty';
    // if (!form.comment)
    //   error.comment = 'The field cannot be empty';
    // if (!form.organization)
    //   error.organization = 'The field cannot be empty';
    // if (!form.indicator)
    //   error.indicator = 'The field cannot be empty';
    // if (!form.startTime)
    //   error.startTime = 'The field cannot be empty';
    // if (!form.endTime)
    //   error.endTime = 'The field cannot be empty';
    // if (form.uri && !isValidURL(form.uri))
    //   error.uri = 'The field cannot be empty'
    // if (!!form.startTime && !!form.endTime && form.startTime > form.endTime){
    //   error.startTime = 'The date must be earlier than the end date'
    //   error.endTime = 'The date must be later than the start date';
    // }
    //
    // if (!form.numericalValue)
    //   error.numericalValue = 'The field cannot be empty';
    if (form.numericalValue && isNaN(form.numericalValue))
      error.numericalValue = 'The field must be a number';
    // if (!form.unitOfMeasure)
    //   error.unitOfMeasure = 'The field cannot be empty';
    // if (!form.dateCreated)
    //   error.dateCreated = 'The field cannot be empty';
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  if (loading)
    return <Loading/>;

  return (
    <Container maxWidth="md">
      {mode === 'view'? (
        <Paper sx={{p: 2}} variant={'outlined'}>

          <Typography variant={'h6'}> {`Name:`} </Typography>
          <Typography variant={'body1'}> {`${form.name || 'Not Given'}`} </Typography>
          <Typography variant={'h6'}> {`URI:`} </Typography>
          <Typography variant={'body1'}> {`${form.uri}`} </Typography>
          <Typography variant={'h6'}> {`value:`} </Typography>
          <Typography variant={'body1'}> {`${form.numericalValue || 'Value Not Given'} (${form.unitOfMeasure || 'Unit of Measure Not Given'})`} </Typography>
          <Typography variant={'h6'}> {`Indicator:`} </Typography>
          <Typography variant={'body1'}> <Link to={`/indicator/${encodeURIComponent(form.indicator)}/view`} colorWithHover color={'#2f5ac7'}>{form.indicatorName}</Link> </Typography>
          <Typography variant={'h6'}> {`Organization:`} </Typography>
          <Typography variant={'body1'}> <Link to={`/organizations/${encodeURIComponent(form.organization)}/view`} colorWithHover color={'#2f5ac7'}>{form.organizationName}</Link> </Typography>
          <Typography variant={'h6'}> {`Date Created:`} </Typography>
          <Typography variant={'body1'}> {form.dateCreated ? `${(new Date(form.dateCreated)).toLocaleDateString()}`: 'Not Given'} </Typography>
          <Typography variant={'h6'}> {`Time Interval:`} </Typography>
          <Typography variant={'body1'}> {(form.startTime && form.endTime)? `${(new Date(form.startTime)).toLocaleString()} to ${(new Date(form.endTime)).toLocaleString()}` : 'Not Given'} </Typography>
          <Typography variant={'h6'}> {`Datasets:`} </Typography>
          {form.datasets?.length?
            form.datasets.map(dataset => <Typography variant={'body1'}> {<Link to={`/dataset/${encodeURIComponent(dataset)}/view`} colorWithHover
                                                                               color={'#2f5ac7'}>{datasetInterfaces[dataset]}</Link>} </Typography>)

            : <Typography variant={'body1'}> {`Not Given`} </Typography>}

          <Button variant="contained" color="primary" className={classes.button} onClick={()=>{
            navigate(`/indicatorReport/${encodeURIComponent(uri)}/edit`);
          }
          }>
            Edit
          </Button>

        </Paper>
      ): (<Paper sx={{p: 2}} variant={'outlined'}>
        <Typography variant={'h4'}> Indicator Report </Typography>
        <IndicatorReportField
          disabled={mode === 'view'}
          disabledOrganization={!!orgUri}
          defaultValue={form}
          required
          onChange={(state) => {
            setForm(form => ({...form, ...state}));
          }}
          uriDiasbled={mode !== 'new'}
          importErrors={errors}
        />

        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          Submit
        </Button>

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={mode === 'new' ? 'Are you sure you want to create this new Indicator Report?' :
                       'Are you sure you want to update this Indicator Report?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children="confirm" autoFocus/>]}
                     open={state.submitDialog}/>
      </Paper>)}

    </Container>);

}