import React, { useState } from "react";
import CustomInput from "../../../../shared/components/CustomInput/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../shared/redux/store";
import { applyPlaylist, createPlaylist, deletePlaylist, getPlaylists } from "../../services/songServices";
import useSongs from "../../../../shared/hooks/useSongs";
import PlaylistModalStyled from "./PlaylistModalStyled";
import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";
import Playlist from "../Playlist/Playlist";
import CustomButton from "../../../../shared/components/CustomButton/CustomButton";
import CustomIconButton from "../../../../shared/components/CustomIconButton/CustomIconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "../../../../shared/components/Loader/Loader";
import { toggleModal } from "../../../../shared/redux/reducers/modalSlice";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  roomId: string;
}

const PlaylistModal = ({ roomId }: Props) => {
  const { songs } = useSongs(roomId);
  const [playlistName, setPlaylistName] = useState("");
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery<DocumentData[]>({
    queryKey: ["getPlaylists"],
    queryFn: () => getPlaylists(user),
  });

  const handleCreatePlaylistClick = () => {
    createPlaylist({ user, playlistName, songs });
    dispatch(toggleModal(null));
  };

  const handleExpandPlaylist = (playlistId: string) => {
    setExpandedPlaylistId((prev) => (prev === playlistId ? null : playlistId));
  };

  const handleApplyPlaylist = async (playlistData: DocumentData) => {
    await applyPlaylist({ roomId, user, playlist: playlistData });
  };

  const handleDeletePlaylist = (playlistName: string) => {
    deletePlaylist({ playlistName, user });
  };

  return (
    <PlaylistModalStyled>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="input">
            <CustomInput
              buttonLabel="Create Playlist"
              onClick={handleCreatePlaylistClick}
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaylistName(e.target.value)}
            />
          </div>
          {data &&
            Object.entries(data).map(([playlistId, playlistData]) => (
              <li key={playlistId} className={expandedPlaylistId === playlistId ? "expanded" : "notExpanded"}>
                <span onClick={() => handleExpandPlaylist(playlistId)}>
                  {expandedPlaylistId === playlistId ? <RemoveIcon /> : <AddIcon />}
                  {playlistId}
                </span>
                {expandedPlaylistId === playlistId && <Playlist playlistData={playlistData} />}
                <div className="applyPlaylist">
                  <CustomButton label="Apply Playlist" onClick={() => handleApplyPlaylist(playlistData)} />
                  <CustomIconButton color="warning" onClick={() => handleDeletePlaylist(playlistId)}>
                    <DeleteIcon />
                  </CustomIconButton>
                </div>
              </li>
            ))}
        </>
      )}
    </PlaylistModalStyled>
  );
};

export default PlaylistModal;
