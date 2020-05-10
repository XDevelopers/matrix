import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "../../components/Grid";
import ManageRoomsCard from "../../components/ManageRoomsCard";
import RoomCard from "../../components/RoomCard";
import {
  selectOffice,
  selectCurrentRoom,
  selectRooms,
  selectCurrentUser
} from "../store/selectors";
import { emitEnterInRoom, emitStartMeeting, emitLeftMeeting } from "../socket";
import { setCurrentRoom } from "../store/actions";
import { CurrentRoomPropType, CurrentUserPropType } from "../store/models";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  }
}));

const OfficePage = ({
  onSetCurrentRoom,
  history,
  match,
  office,
  rooms,
  currentRoom,
  currentUser
}) => {
  const classes = useStyles();
  useState(() => {
    if (currentRoom && match.params.roomId !== currentRoom.id) {
      const findResult = rooms.find(r => r.id === match.params.roomId);
      if (findResult) {
        emitEnterInRoom(findResult.id);
        onSetCurrentRoom(findResult);
      } else {
        history.push("/morpheus/");
      }
    }
  }, [match.params.roomId]);

  return (
    <div className={classes.root}>
      <Grid>
        {office.map(room => (
          <RoomCard
            {...room}
            key={room.id}
            currentUser={currentUser}
            onEnterRoom={() => {
              emitEnterInRoom(room.id);
              onSetCurrentRoom(room);
              history.replace(`/morpheus/office/${room.id}`);
            }}
            onEnterMeeting={() => {
              emitEnterInRoom(room.id);
              onSetCurrentRoom(room);
              console.log(room.externalMeetUrl);
              if (room.externalMeetUrl) {
                console.log('currentUser', currentUser)
                emitStartMeeting();
                const urlAppend = (room.externalMeetUrl.indexOf('?') != -1 ? '&' : '?') + 'authuser=' + currentUser.email;
                var externalMeetRoom = window.open(room.externalMeetUrl + urlAppend);

                var externalMeetRoomMonitoring = function () {
                  window.setTimeout(function () {
                    if (externalMeetRoom.closed) {
                      console.log('The external meeting has been closed');
                      emitLeftMeeting();
                    } else {
                      externalMeetRoomMonitoring();
                    }

                  }, 1000);
                }

                externalMeetRoomMonitoring();

              } else {
                history.push(`/morpheus/room/${room.id}`);
              }
            }}
          />
        ))}
        <ManageRoomsCard />
      </Grid>
    </div>
  );
};

OfficePage.propTypes = {
  onSetCurrentRoom: PropTypes.func,
  office: PropTypes.arrayOf(PropTypes.object),
  rooms: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomId: PropTypes.string
    }).isRequired
  }).isRequired,
  currentRoom: CurrentRoomPropType,
  currentUser: CurrentUserPropType
};

OfficePage.defaultProps = {
  onSetCurrentRoom: () => { },
  office: [],
  rooms: [],
  currentRoom: {},
  currentUser: {}
};

const mapStateToProps = state => ({
  office: selectOffice(state),
  rooms: selectRooms(state),
  currentRoom: selectCurrentRoom(state),
  currentUser: selectCurrentUser(state)
});

const mapDispatchToProps = {
  onSetCurrentRoom: setCurrentRoom
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OfficePage);
