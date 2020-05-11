import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import Loading from "../components/Loading";
import PageLayout from "../components/PageLayout";
import MenuUsers from "../components/MenuUsers";
import InviteToMeetingDialog from "../components/InviteToMeetingDialog";
import ReceiveInviteDialog from "../components/ReceiveInviteDialog";
import MessageDialog from "../components/MessageDialog";
import KnockDialog from "../components/KnockDialog";
import AnswerKnockDialog from "../components/AnswerKnockDialog";
import Error500 from "../components/Error500";
import PageRoutes, { AppBarRouter } from "./Routes";
import ConfirmLogoutDialog from "./containers/ConfirmLogoutDialog";
import { joinExternalMeetingForRoom } from "./containers/OfficePage";

import { emitEnterInRoom, emitInviteUser, emitKnockRoom, emitAllowUserEnterRoom } from "./socket";
import {
  setCurrentUser,
  setCurrentRoom,
  addRooms,
  updateRooms,
  syncOffice,
  changeUsersFilter,
  addUser,
  addError,
  removeUser,
  userEnterMeeting,
  userLeftMeeting,
  closeKnockDialog,
  openAnswerKnockDialog,
  closeAnswerKnockDialog
} from "./store/actions";
import {
  selectRooms,
  selectCurrentUser,
  selectUsers,
  selectUsersFilter,
  selectCurrentRoom,
  selectError,
  selectSystemSettings,
  selectTheme,
  selectKnockDialog,
  selectAnswerKnockDialog
} from "./store/selectors";
import {
  CurrentRoomPropType,
  RoomsPropType,
  CurrentUserPropType,
  SettingsPropType,
  UsersPropType,
  UsersFilterPropType,
  ErrorPropType
} from "./store/models";
import useSocket from "./hooks/useSocket";
import useEvents from "./hooks/useEvents";

const MorpheusApp = ({
  onChangeUsersFilter,
  onSetCurrentUser,
  onSetCurrentRoom,
  onAddRooms,
  onUpdateRooms,
  onSyncOffice,
  onAddUser,
  onAddError,
  onRemoveUser,
  onUserEnterMeeting,
  onUserLeftMeeting,
  onCloseKnockDialog,
  onOpenAnswerKnockDialog,
  onCloseAnswerKnockDialog,
  history,
  currentRoom,
  settings,
  rooms,
  currentUser,
  users,
  usersFilter,
  knockDialog,
  answerKnockDialog,
  error
}) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, toggleLoading] = useState(true);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [userToInvite, setUserToInvite] = useState();
  const [isReceiveInviteOpen, setReceiveInviteOpen] = useState(false);
  const [invitation, setInvitation] = useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useSocket(
    toggleLoading,
    setLoggedIn,
    onSetCurrentUser,
    onSetCurrentRoom,
    onAddRooms,
    onAddError
  );
  useEvents(
    onUpdateRooms,
    onSyncOffice,
    onAddUser,
    onRemoveUser,
    onUserEnterMeeting,
    onUserLeftMeeting,
    enqueueSnackbar,
    closeSnackbar,
    onOpenAnswerKnockDialog,
    setReceiveInviteOpen,
    setInvitation,
    isLoggedIn,
    rooms,
    settings,
    currentUser,
    currentRoom,
    onSetCurrentRoom,
    history
  );

  if (error) {
    return (
      <Error500
        onReload={() => {
          window.location.reload();
        }}
      />
    );
  }

  return (
    <>
      <PageLayout
        renderAppBarMenu={() => <AppBarRouter />}
        renderSideBarMenu={() => (
          <MenuUsers
            users={users}
            filter={usersFilter}
            currentUser={currentUser}
            currentRoom={currentRoom}
            onChangeFilter={(key, value) => {
              onChangeUsersFilter(key, value);
            }}
            onInviteUser={user => {
              setUserToInvite(user);
              setInviteModalOpen(true);
            }}
          />
        )}
      >
        {isLoading ? <Loading /> : <PageRoutes />}
      </PageLayout>
      <InviteToMeetingDialog
        open={isInviteModalOpen}
        user={userToInvite}
        currentRoomName={currentRoom.name}
        onClose={() => {
          setInviteModalOpen(false);
        }}
        onConfirm={() => {
          emitInviteUser(userToInvite.id);
        }}
      />
      <ReceiveInviteDialog
        open={isReceiveInviteOpen}
        invitation={invitation}
        onClose={() => {
          setReceiveInviteOpen(false);
        }}
        onConfirm={() => {
          emitEnterInRoom(invitation.room.id);
          if (invitation.room.externalMeetUrl) {
            history.push(`/morpheus/office/${invitation.room.id}`);
            joinExternalMeetingForRoom(currentUser, invitation.room);
          } else {
            history.push(`/morpheus/room/${invitation.room.id}`);
          }
        }}
      />
      <KnockDialog
        open={knockDialog.isOpen}
        currentRoomName={knockDialog.roomName}
        onClose={onCloseKnockDialog}
        onConfirm={() => {
          onCloseKnockDialog();
          emitKnockRoom(knockDialog.roomId);
        }}
      />
      <AnswerKnockDialog
        open={answerKnockDialog.isOpen}
        userName={answerKnockDialog.userName}
        roomName={answerKnockDialog.roomName}
        onClose={onCloseAnswerKnockDialog}
        onConfirm={() => {
          onCloseAnswerKnockDialog();
          emitAllowUserEnterRoom(answerKnockDialog.userId, answerKnockDialog.roomId)
        }}
      />
      <MessageDialog />
      <ConfirmLogoutDialog />
    </>
  );
};

MorpheusApp.propTypes = {
  onChangeUsersFilter: PropTypes.func,
  onSetCurrentUser: PropTypes.func,
  onSetCurrentRoom: PropTypes.func,
  onAddRooms: PropTypes.func,
  onUpdateRooms: PropTypes.func,
  onSyncOffice: PropTypes.func,
  onAddUser: PropTypes.func,
  onAddError: PropTypes.func,
  onRemoveUser: PropTypes.func,
  onUserEnterMeeting: PropTypes.func,
  onUserLeftMeeting: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  currentRoom: CurrentRoomPropType.isRequired,
  rooms: RoomsPropType.isRequired,
  currentUser: CurrentUserPropType.isRequired,
  users: UsersPropType.isRequired,
  usersFilter: UsersFilterPropType.isRequired,
  settings: SettingsPropType.isRequired,
  error: ErrorPropType
};

MorpheusApp.defaultProps = {
  onChangeUsersFilter: () => { },
  onSetCurrentUser: () => { },
  onSetCurrentRoom: () => { },
  onAddRooms: () => { },
  onUpdateRooms: () => { },
  onSyncOffice: () => { },
  onAddUser: () => { },
  onAddError: () => { },
  onRemoveUser: () => { },
  onUserEnterMeeting: () => { },
  onUserLeftMeeting: () => { },
  error: undefined
};

const mapStateToProps = state => ({
  theme: selectTheme(state),
  currentRoom: selectCurrentRoom(state),
  rooms: selectRooms(state),
  currentUser: selectCurrentUser(state),
  users: selectUsers(state),
  usersFilter: selectUsersFilter(state),
  settings: selectSystemSettings(state),
  error: selectError(state),
  knockDialog: selectKnockDialog(state),
  answerKnockDialog: selectAnswerKnockDialog(state)
});

const mapDispatchToProps = {
  onChangeUsersFilter: changeUsersFilter,
  onSetCurrentUser: setCurrentUser,
  onSetCurrentRoom: setCurrentRoom,
  onAddRooms: addRooms,
  onUpdateRooms: updateRooms,
  onSyncOffice: syncOffice,
  onAddUser: addUser,
  onAddError: addError,
  onRemoveUser: removeUser,
  onUserEnterMeeting: userEnterMeeting,
  onUserLeftMeeting: userLeftMeeting,
  onCloseKnockDialog: closeKnockDialog,
  onOpenAnswerKnockDialog: openAnswerKnockDialog,
  onCloseAnswerKnockDialog: closeAnswerKnockDialog
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MorpheusApp)
);
