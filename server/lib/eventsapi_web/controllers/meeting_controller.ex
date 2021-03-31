defmodule EventsApiWeb.MeetingController do
  use EventsApiWeb, :controller

  alias EventsApi.Meetings
  alias EventsApi.Meetings.Meeting
  alias EventsApiWeb.Plugs

  plug Plugs.RequireAuth when action in [:create]
  plug :requireOwner when action in [:update, :delete]

  action_fallback EventsApiWeb.FallbackController

  def requireOwner(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id",
          token, max_age: 86400*3) do
      {:ok, user_id} ->
        meeting = EventsApi.Meetings.get_meeting!(conn.params["id"])
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

  def index(conn, _params) do
    meetings = Meetings.list_meetings()
    render(conn, "index.json", meetings: meetings)
  end

  def create(conn, %{"meeting" => meeting_params}) do
    case Meetings.create_meeting(meeting_params) do
      {:ok, %Meeting{} = meeting} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.meeting_path(conn, :show, meeting))
        |> render("show.json", meeting: meeting)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> put_view(EventsApiWeb.ErrorView)
        |> render("error.json", changeset: changeset)
      _ -> raise "Unknown response: meeting_controller -> create -> default case"
    end
  end

  def show(conn, %{"id" => id}) do
    meeting = Meetings.get_meeting!(id)
    render(conn, "showExpanded.json", meeting: meeting)
  end

  def update(conn, %{"id" => id, "meeting" => meeting_params}) do
    meeting = Meetings.get_meeting!(id)

    with {:ok, %Meeting{} = meeting} <- Meetings.update_meeting(meeting, meeting_params) do
      render(conn, "show.json", meeting: meeting)
    end
  end

  def delete(conn, %{"id" => id}) do
    meeting = Meetings.get_meeting!(id)

    with {:ok, %Meeting{}} <- Meetings.delete_meeting(meeting) do
      send_resp(conn, :no_content, "")
    end
  end
end
