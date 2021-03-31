defmodule EventsApiWeb.InviteController do
  use EventsApiWeb, :controller

  alias EventsApi.Invites
  alias EventsApi.Invites.Invite

  plug :requireMeetingOwnerCreate when action in [:create]
  plug :requireMeetingOwnerDelete when action in [:delete]
  plug :requireInvited when action in [:update]

  action_fallback EventsApiWeb.FallbackController

  def requireMeetingOwnerCreate(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id",
          token, max_age: 86400*3) do
      {:ok, user_id} ->
        meeting = EventsApi.Meetings.get_meeting!(conn.params["invite"]["meeting_id"])
        if meeting.user_id == user_id do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "this is not your meeting"}))
          |> halt()
        end
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity,Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end

  def requireMeetingOwnerDelete(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id",
          token, max_age: 86400*3) do
      {:ok, user_id} ->
        meeting = EventsApi.Invites.get_invite!(conn.params["id"]).meeting
        if meeting.user_id == user_id do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "this is not your meeting"}))
          |> halt()
        end
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity,Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end

  def requireInvited(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id",
          token, max_age: 86400*3) do
      {:ok, user_id} ->
        targetEmail = conn.params["invite"]["email"]
        user = EventsApi.Users.get_user!(user_id)
        if targetEmail == user.email do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "this is not your invite"}))
          |> halt()
        end
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity,Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end

  def index(conn, _params) do
    invites = Invites.list_invites()
    render(conn, "index.json", invites: invites)
  end

  def create(conn, %{"invite" => invite_params}) do
    invite = Invites.create_invite(invite_params)
    case invite do
      {:ok, %Invite{} = invite} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.invite_path(conn, :show, invite))
        |> render("show.json", invite: invite)
      {:exists, %Invite{} = invite} ->
        conn
        |> render("show.json", invite: invite)
      _ ->
        raise "idk what to do here"
    end
  end

  def show(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    render(conn, "show.json", invite: invite)
  end

  def update(conn, %{"id" => id, "invite" => invite_params}) do
    invite = Invites.get_invite!(id)

    with {:ok, %Invite{} = invite} <- Invites.update_invite(invite, invite_params) do
      render(conn, "show.json", invite: invite)
    end
  end

  def delete(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)

    with {:ok, %Invite{}} <- Invites.delete_invite(invite) do
      send_resp(conn, :no_content, "")
    end
  end
end
