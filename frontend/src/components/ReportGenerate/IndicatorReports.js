import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import {Link, Loading} from "../shared";
import {Button, Chip, Container, Paper, Typography} from "@mui/material";
import {
  fetchOrganizations,
} from "../../api/organizationApi";
import SelectField from "../shared/fields/SelectField";
import {Undo, PictureAsPdf, FileDownload} from "@mui/icons-material";
import {fetchIndicators} from "../../api/indicatorApi";
import {jsPDF} from "jspdf";
import {reportErrorToBackend} from "../../api/errorReportApi";
import {useSnackbar} from "notistack";
import {navigate, navigateHelper} from "../../helpers/navigatorHelper";
import {UserContext} from "../../context";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginLeft: 10,
    marginTop: 12,
    marginBottom: 0,
    length: 100
  },
  link: {
    marginTop: 20,
    marginLeft: 15,
    color: '#007dff',
  }
}));


export default function IndicatorReports_ReportGenerate() {
  const navigator = useNavigate();
  const navigate = navigateHelper(navigator);
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  const userContext = useContext(UserContext);

  const [organizations, setOrganizations] = useState({});
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);


  const generateTXTFile = () => {
    let str = '';
    const addLine = (line, space) => {
      if (space)
        [...Array(space).keys()].map(() => {
          str += ' ';
        });
      str += line + '\n';
    };
    // const pdf = new jsPDF({
    //   orientation: 'p',
    //   unit: 'mm',
    //   format: 'a5',
    //   putOnlyUsedFonts:true
    // });


    // let x = 20
    // let y = 20
    // pdf.setFontSize(20);
    // pdf.text("Indicator Reports", x, y);
    // y += 6;
    // pdf.setFontSize(10);
    // pdf.text(`Generated at ${(new Date).toLocaleString()}`, x, y);
    // y += 10;
    // indicators?.map(indicator => {
    //   x = 23;
    //   y += 6
    //   pdf.text(`Indicator Name: ${indicator.name}`, x, y)
    //   y += 6;
    //   pdf.text(`Unit of Measure: ${indicator.unitOfMeasure.label}`, x, y);
    //   y += 6;
    //   indicator.indicatorReports?.map(indicatorReport => {
    //     x = 26
    //     pdf.text(`Indicator Report Name: ${indicatorReport.name}`, x, y)
    //     y += 6
    //   })
    // })
    // pdf.save('indicator report.pdf');

    indicators.map(indicator => {
      addLine(`Indicator: ${indicator.name || 'Name not Given'}`, 2);
      addLine(`Unit of Measure: ${indicator.unitOfMeasure?.label || 'Not Given'}`, 6);
      indicator.indicatorReports?.map(indicatorReport => {
        addLine(`Indicator Report: ${indicatorReport.name || 'Name Not Given'}`, 6);
        addLine(`Value: ${indicatorReport.value?.numericalValue || 'Not Given'}`, 10);
        addLine(indicatorReport.hasTime ? `Time Interval: ${(new Date(indicatorReport.hasTime.hasBeginning?.date)).toLocaleString()} to ${(new Date(indicatorReport.hasTime.hasEnd?.date)).toLocaleString()}` : '', 10);
      });
    });

    const file = new Blob([str], {type: 'text/plain'});
    saveAs(file, 'indicatorReport.txt');
  };


  useEffect(() => {
    fetchOrganizations().then(({organizations, success}) => {
      if (success) {
        const organizationsOps = {};
        if (userContext.isSuperuser)
          organizationsOps['all'] = 'All Indicators';
        organizations.map(organization => {
          organizationsOps[organization._uri] = organization.legalName;
        });
        setOrganizations(organizationsOps);
        setLoading(false);
      }
    }).catch(e => {
      reportErrorToBackend(e);
      setLoading(false);
      enqueueSnackbar(e.json?.message || "Error occurs when fetching organizations", {variant: 'error'});
    });

  }, []);

  useEffect(() => {
    if (selectedOrganization) {
      fetchIndicators(encodeURIComponent(selectedOrganization)).then(({success, indicators}) => {
        if (success) {
          setIndicators(indicators);
        }
      }).catch(e => {
        reportErrorToBackend(e);
        setLoading(false);
        enqueueSnackbar(e.json?.message || "Error occurs when fetching indicators", {variant: 'error'});
      });
    } else {
      setIndicators([]);
    }
  }, [selectedOrganization]);

  if (loading)
    return <Loading/>;

  return (
    <Container maxWidth="md">
      <Paper sx={{p: 2}} variant={'outlined'} sx={{position: 'relative'}}>
        <Typography variant={'h4'}> Indicators </Typography>

        <Button variant="outlined"
                sx={{position: 'absolute', right: 0, marginTop: 1.5, backgroundColor: '#dda0dd', color: 'white'}}
                onClick={() => {
                  navigate('/reportGenerate');
                }} startIcon={<Undo/>}>
          Back
        </Button>
        {indicators.length ?
          <Button variant="contained" color="primary" className={classes.button}
                  sx={{position: 'absolute', right: 100, marginTop: 0}}
                  onClick={generateTXTFile} startIcon={<FileDownload/>}>
            Generate TXT File
          </Button>
          :
          null}

        <SelectField
          key={'organization'}
          label={'Organization'}
          value={selectedOrganization}
          options={organizations}
          defaultOptionTitle={'Select an organization'}
          onChange={e => {
            setSelectedOrganization(
              e.target.value
            );
          }}
        />
        {indicators.length ? indicators.map((indicator, index) => {
          return (

            <Paper sx={{p: 2}} variant={'outlined'}>
              <Typography variant={'h6'}> {`Indicator: ${indicator.name || 'Name Not Given'}`}  </Typography>
              <Typography variant={'body1'} sx={{pl: 4}}> {'Name: '}<Link
                to={`/indicator/${encodeURIComponent(indicator._uri)}/view`} colorWithHover
                color={'#2f5ac7'}>{indicator.name || ''}</Link> </Typography>
              <Typography variant={'body1'}
                          sx={{pl: 4}}> {`Has Identifier: ${indicator.identifier || 'Not Given'}`} </Typography>
              <Typography variant={'body1'}
                          sx={{pl: 4}}> {`Date Created: ${(new Date(indicator.dateCreated)).toLocaleString() || 'Not Given'}`} </Typography>
              <Typography variant={'body1'}
                          sx={{pl: 4}}> {`Baseline: ${indicator.baseline?.numericalValue || 'Not Given'}`} </Typography>
              <Typography variant={'body1'}
                          sx={{pl: 4}}> {`Threshold: ${indicator.threshold?.numericalValue || 'Not Given'}`} </Typography>
              <Typography variant={'body1'}
                          sx={{pl: 4}}> {`Unit of Measure: ${indicator.unitOfMeasure?.label || 'Not Given'}`} </Typography>
              {indicator.datasets ?
                (indicator.datasets.map(dataset =>
                  <Typography variant={'body1'} sx={{pl: 4}}> {'Dataset: '}<Link
                    to={`/dataset/${encodeURIComponent(dataset._uri)}/view`} colorWithHover
                    color={'#2f5ac7'}>{dataset.name || dataset._uri}</Link> </Typography>
                ))
                : null}

              {indicator.codes ?
                (indicator.codes.map(code =>
                  <Typography variant={'body1'} sx={{pl: 4}}> {'Code: '}<Link
                    to={`/code/${encodeURIComponent(code._uri)}/view`} colorWithHover
                    color={'#2f5ac7'}>{code.name || code._uri}</Link> </Typography>
                ))
                : null}

              {indicator.indicatorReports ?
                (indicator.indicatorReports.map(indicatorReport =>
                  <Paper elevation={0} sx={{pl: 4}}>
                    <Typography variant={'body1'}> {`Indicator Report: `}<Link
                      to={`/indicatorReport/${encodeURIComponent(indicatorReport._uri)}/view`}
                      colorWithHover>{indicatorReport.name || 'Name Not Given'}</Link> </Typography>
                    <Typography variant={'body1'}
                                sx={{pl: 4}}> {`Value: ${indicatorReport.value?.numericalValue || ''}`} </Typography>
                    {indicatorReport.hasTime ?
                      <Typography variant={'body1'}
                                  sx={{pl: 4}}> {`Time Interval: ${(new Date(indicatorReport.hasTime.hasBeginning.date)).toLocaleString()} to ${(new Date(indicatorReport.hasTime.hasEnd.date)).toLocaleString()}`} </Typography> : null}
                    {indicatorReport.datasets ?
                      (indicatorReport.datasets.map(dataset =>
                        <Typography variant={'body1'} sx={{pl: 4}}> {'Dataset: '}<Link
                          to={`/dataset/${encodeURIComponent(dataset._uri)}/view`} colorWithHover
                          color={'#2f5ac7'}>{dataset.name || dataset._uri}</Link> </Typography>
                      ))
                      : null}
                    {indicatorReport.dateCreated ?
                      <Typography variant={'body1'}
                                  sx={{pl: 4}}> {`Date Created: ${(new Date(indicatorReport.dateCreated)).toLocaleString()}`} </Typography> : null}

                  </Paper>
                ))
                : null
              }
            </Paper>

          );
        }) : null}

      </Paper>


    </Container>
  );

}