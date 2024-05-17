import React, {useEffect, useState, useContext} from 'react';
import {Chip, Container} from "@mui/material";
import {Add as AddIcon, Check as YesIcon} from "@mui/icons-material";
import {DeleteModal, DropdownMenu, Link, Loading, DataTable} from "../shared";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from 'notistack';
import {deleteOrganization} from "../../api/organizationApi";
import {UserContext} from "../../context";
import {navigateHelper} from "../../helpers/navigatorHelper";
import {fetchDataTypes} from "../../api/generalAPI";

export default function Organization_indicators() {
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
      if (res.success)
        setState(state => ({...state, loading: false, data: res.organizations}));
    }).catch(e => {
      setState(state => ({...state, loading: false}));
      navigate('/dashboard');
      enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
    });
  }, [trigger]);

  // useEffect(() => {
  //   fetchStakeholders().then(res => {
  //     if (res.success)
  //       setState(state => ({...state, loading: false, data: res.stakeholders}));
  //   }).catch(e => {
  //     setState(state => ({...state, loading: false}));
  //     navigate('/dashboard');
  //     enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
  //   });
  // }, [trigger]);

  const showDeleteDialog = (id) => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true,
      deleteDialogTitle: 'Delete organization ' + id + ' ?'
    }));
  };

  const handleDelete = async (id, form) => {

    deleteOrganization(id).then(({success, message}) => {
      if (success) {
        setState(state => ({
          ...state, showDeleteDialog: false,
        }));
        setTrigger(!trigger);
        enqueueSnackbar(message || "Success", {variant: 'success'});
      }
    }).catch((e) => {
      setState(state => ({
        ...state, showDeleteDialog: false,
      }));
      setTrigger(!trigger);
      enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
    });

  };

  const columns = [
    {
      label: 'Legal Name',
      body: ({_uri, legalName}) => {
        return <Link colorWithHover to={`/indicators/${encodeURIComponent(_uri)}`}>
          {legalName}
        </Link>;
      },
      sortBy: ({legalName}) => legalName
    },
    {
      label: 'Administrator',
      body: ({administrator}) => {
        return administrator;
      }
    },
    // {
    //   label: 'Last name',
    //   body: ({person}) => {
    //     if(person && person.familyName)
    //       return person.familyName
    //     return 'Not Provided'
    //   }
    // },
    // {
    //   label: 'Phone Number',
    //   body: ({primaryContact}) => {
    //     if (primaryContact && primaryContact.telephone)
    //       return formatPhoneNumber(primaryContact.telephone);
    //     return 'Not Provided';
    //   },
    // },

    // {
    //   label: ' ',
    //   body: ({_id}) =>
    //     <DropdownMenu urlPrefix={'organizations'} objectId={_id}
    //                   hideViewOption hideEditOption hideDeleteOption
    //                   handleDelete={() => showDeleteDialog(_id)}/>
    // }
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
            disabled={!userContext.isSuperuser && !userContext.editorOfs.length}
            onClick={() => navigate('/indicator/new')}
            color="primary"
            icon={<AddIcon/>}
            label="Add a new Indicator"
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
