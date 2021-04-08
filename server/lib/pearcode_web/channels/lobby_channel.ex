defmodule PearcodeWeb.LobbyChannel do
  use PearcodeWeb, :channel

  alias Pearcode.Lobby
  alias Pearcode.LobbyServer
  alias Pearcode.JudgeHandler
  alias PearcodeWeb.LobbyPresence

  @impl true
  def join("lobby:" <> id, payload, socket) do

      LobbyServer.start(id)
      lobby = LobbyServer.peek(id)

      send(self(), {:after_join, lobby})
      socket = assign(socket, :lobby_id, id)
      socket = assign(socket, :user_name, payload["name"])
      socket = assign(socket, :user_id, payload["user_id"])
      {:ok, lobby, socket}
  end

  @impl true
  def handle_info({:after_join, _lobby}, socket) do
      LobbyPresence.track_user_join(socket, socket.assigns.user_name, socket.assigns.user_id)
      push(socket, "presence_state", LobbyPresence.list(socket))
      {:noreply, socket}
  end

  @impl true
  def handle_in("update", payload, socket) do
      LobbyPresence.do_user_update(socket, socket.assigns.lobby_id, socket.assigns.user_id, socket.assigns.user_name, %{typing: true})

      lobby_id = socket.assigns[:lobby_id]
      lobby = LobbyServer.update(lobby_id, payload["body"])

      broadcast_from! socket, "updated", lobby
      {:noreply, socket}
  end

  @impl true
  def handle_in("stoptyping", _payload, socket) do
    LobbyPresence.do_user_update(socket, socket.assigns.lobby_id, socket.assigns.user_id, socket.assigns.user_name, %{typing: false})
    {:noreply, socket}
  end

  @impl true
  def handle_in("execute", payload, socket) do
      lobby = socket.assigns[:lobby]
      broadcast! socket, "executing", lobby
      lobby_id = socket.assigns[:lobby_id]
      #JudgeHandler.execute(lobby[:body], payload["language"], lobby_id)

      # todo
      {:noreply, socket}
  end

  def handle_in("set_language", payload, socket) do
      language_id = payload["language"]
      broadcast! socket, "new_language", %{language: language_id}

      {:noreply, socket}
  end
end
