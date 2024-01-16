import React, { useEffect, useState, useContext } from 'react';
import { Chip, Container } from "@mui/material";
import { Add as AddIcon, Check as YesIcon } from "@mui/icons-material";
import { DeleteModal, DropdownMenu, Link, Loading, DataTable } from "../shared";
import { useSnackbar } from 'notistack';
import {deleteOrganization} from "../../api/organizationApi";
import {UserContext} from "../../context";
import {reportErrorToBackend} from "../../api/errorReportApi";
import {navigateHelper} from "../../helpers/navigatorHelper";
import {useNavigate} from "react-router-dom";
import {fetchDataTypes} from "../../api/generalAPI";

export default function Organizations() {

  const {enqueueSnackbar} = useSnackbar();
  const navigator = useNavigate();
  const navigate = navigateHelper(navigator)


  const userContext = useContext(UserContext);
  const [state, setState] = useState({
    loading: true,
    data: [],
    selectedId: null,
    deleteDialogTitle: '',
    showDeleteDialog: false,
  });
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    fetchDataTypes('organization').then(res => {
      if(res.success)
      setState(state => ({...state, loading: false, data: res.organizations}));
    }).catch(e => {
      reportErrorToBackend(e)
      setState(state => ({...state, loading: false}))
      navigate('/dashboard');
      enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
    });
  }, [trigger]);

  const showDeleteDialog = (id) => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true,
      deleteDialogTitle: 'Delete organization ' + id + ' ?'
    }));
  };

  const handleDelete = async (id, form) => {

    deleteOrganization(id).then(({success, message})=>{
      if (success) {
        setState(state => ({
          ...state, showDeleteDialog: false,
        }));
        setTrigger(!trigger);
        enqueueSnackbar(message || "Success", {variant: 'success'})
      }
    }).catch((e)=>{
      setState(state => ({
        ...state, showDeleteDialog: false,
      }));
      setTrigger(!trigger);
      enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
    });

  };

  const columns = [
    {
      label: 'Organization ID',
      body: ({_uri, hasId , editable}) => {
        return editable?
          <Link colorWithHover to={`/organizations/${encodeURIComponent(_uri)}/view/`}>
          {hasId}
        </Link>:
          hasId
      },
      sortBy: ({legalName}) => legalName
    },
    {
      label: 'Organization Name',
      body: ({legalName}) => {
        return legalName;
      }
    },
    {
      label: 'Organization URI',
      body: ({_uri}) => {
        return _uri;
      }
    },

    {
      label: 'Legal Status',
      body: ({legalStatus}) => {
        return legalStatus;
      }
    },
    {
      label: ' ',
      body: ({_uri, editable}) =>
        <DropdownMenu urlPrefix={'organizations'} objectUri={encodeURIComponent(_uri)} hideDeleteOption
                      hideEditOption={!editable}
                      handleDelete={() => showDeleteDialog(_uri)}/>
    }
  ];

  if (state.loading)
    return <Loading message={`Loading organizations...`}/>;

  return (
    <Container>
      <DataTable
        title={"Organizations"}
        data={state.data}
        columns={columns}
        idField="id"
        customToolbar={
          <Chip
            disabled={!userContext.isSuperuser}
            onClick={() => navigate('/organizations/new')}
            color="primary"
            icon={<AddIcon/>}
            label="Add new Organization"
            variant="outlined"/>
        }

      />
      <DeleteModal
        objectId={state.selectedId}
        title={state.deleteDialogTitle}
        show={state.showDeleteDialog}
        onHide={() => setState(state => ({...state, showDeleteDialog: false}))}
        delete={handleDelete}
      />
    </Container>
  );
}
