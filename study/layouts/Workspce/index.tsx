import React, { FC, useCallback, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import fetcher from '@utils/fetcehr';
import axios from 'axios';
import { Redirect, Route, Switch } from 'react-router';
import { Button, Input, Label } from '@pages/SingUp/styles';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspce/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IUser } from '@typings/db';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const onLogout = useCallback(() => {
    axios
      .post(
        'http://localhost:3095/api/users/logout',
        null,
        { withCredentials: true })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  const onClickUserProfile = useCallback((e: any) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback((e: any) => {
    e.preventDefault();

    if (!newWorkspace || !newWorkspace.trim()) return;
    if (!newUrl || !newUrl.trim()) return;

    axios
      .post('http://localhost:3095/api/workspaces', {
        workspace: newWorkspace,
        url: newUrl,
      }, {
        withCredentials: true,
      })
      .then(() => {
        // toast.success('성공적으로 생성되었습니다!', { position: 'bottom-center' });
        mutate(false, false);
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }, [newWorkspace, newUrl]);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  if (!userData) {
    return <Redirect to='/login' />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id='profile-name'>{userData.nickname}</span>
                    <span id='profile-active'>Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>{userData?.Workspaces.map((ws) => {
          return (
            <Link key={ws.id} to={'/workspace/${123}/channel/일반'}>
              <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
            </Link>
          );
        })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu sc</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path='/workspace/channel' component={Channel} />
            <Route path='/workspace/dm' component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id='workspace-label'>
            <span>워크스페이스 이름</span>
            <Input id='workspace' value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id='workspace-url-label'>
            <span>워크스페이스 url</span>
            <Input id='workspace' value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type='submit'>생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Workspace;