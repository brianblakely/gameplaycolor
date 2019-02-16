import React from "react";
import PropTypes from "prop-types";

import { get } from "idb-keyval";

import { useLibraryStyles } from "./LibraryStyles";

import { IconButton, Drawer, List, ListSubheader } from "@material-ui/core";
import { VideoLibrary as LibraryIcon } from "@material-ui/icons";

import AddGame from "./AddGame";
import GameList from "./GameList";
import Homebrew from "./Homebrew";

import { appContext } from "../Context/Context";
import * as actions from "./libraryActions";

const Library = props => {
  const state = React.useContext(appContext);
  const classes = useLibraryStyles();

  React.useEffect(() => {
    get(`games`).then(games => {
      if (!games) {
        return;
      }

      actions.addToLibrary(games);
    });
  }, []);

  return (
    <>
      <IconButton
        aria-label="open settings"
        className={classes.open}
        color="inherit"
        onClick={actions.toggleDrawer(`library`)}
      >
        <LibraryIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={state.libraryOpen}
        onClose={actions.toggleDrawer(`library`)}
      >
        <List
          className={classes.drawer}
          role="button"
          subheader={
            <ListSubheader className={classes.heading}>
              {`Library`}
            </ListSubheader>
          }
          tabIndex={0}
        >
          <AddGame />
          <GameList />
        </List>

        <Homebrew />
      </Drawer>
    </>
  );
};

Library.propTypes = {
  addToLibrary: PropTypes.func.isRequired
};

export default Library;
