import React, { useEffect, useState, useContext } from 'react';
import { Chip, Container } from "@mui/material";
import { Add as AddIcon, Check as YesIcon } from "@mui/icons-material";
import { DeleteModal, DropdownMenu, Link, Loading, DataTable } from "../shared";
import {useNavigate, useParams} from "react-router-dom";
import { useSnackbar } from 'notistack';
import {reportErrorToBackend} from "../../api/errorReportApi";
import {navigateHelper} from "../../helpers/navigatorHelper";
import {fetchDataTypes} from "../../api/generalAPI";
export default function Outcomes() {
  const {enqueueSnackbar} = useSnackbar();
  const {uri} = useParams();
  const navigator = useNavigate();
  const navigate = navigateHelper(navigator)
  const [state, setState] = useState({
    loading: true,
    data: [],
    selectedUri: null,
    deleteDialogTitle: '',
    showDeleteDialog: false,
    editable: false,
  });
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    fetchDataTypes('outcome', encodeURIComponent(uri)).then(res => {
      if(res.success)
        setState(state => ({...state, loading: false, data: res.outcomes, editable: res.editable}));
    }).catch(e => {
      reportErrorToBackend(e)
      setState(state => ({...state, loading: false}))
      navigate('/dashboard');
      enqueueSnackbar(e.json?.message || "Error occurs", {variant: 'error'});
    });
  }, [trigger]);

  const columns = [
    {
      label: 'Name',
      body: ({_uri, name}) => {
        return <Link colorWithHover to={`/outcome/${encodeURIComponent(_uri)}/view`}>
          {name}
        </Link>
      },
      sortBy: ({name}) => name
    },
    {
      label: 'Indicators',
      body: ({indicators}) => {
        return indicators?.map(indicator => indicator.name).join(', ')
        // console.log(indicators)
        // return indicators.join(", ");
      }
    },


    {
      label: ' ',
      body: ({_uri, editable}) =>
        <DropdownMenu urlPrefix={'outcome'} objectUri={encodeURIComponent(_uri)} hideEditOption={!editable} hideDeleteOption
                      handleDelete={() => showDeleteDialog(_uri)}/>
    }
  ];

  if (state.loading)
    return <Loading message={`Loading outcomes...`}/>;

  return (
    <Container>
      <DataTable
        title={"Outcomes"}
        data={state.data}
        columns={columns}
        UriField="uri"
        customToolbar={
          <Chip
            disabled={!state.editable}
            onClick={() => navigate(`/outcome/${encodeURIComponent(uri)}/new`)}
            color="primary"
            icon={<AddIcon/>}
            label="Add new Outcome"
            variant="outlined"/>
        }

      />
      {/*<DeleteModal*/}
      {/*  objectId={state.selectedId}*/}
      {/*  title={state.deleteDialogTitle}*/}
      {/*  show={state.showDeleteDialog}*/}
      {/*  onHide={() => setState(state => ({...state, showDeleteDialog: false}))}*/}
      {/*  delete={handleDelete}*/}
      {/*/>*/}
    </Container>
  );
}
