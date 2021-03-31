defmodule EventsApiWeb.MeetingControllerTest do
  use EventsApiWeb.ConnCase

  alias EventsApi.Meetings
  alias EventsApi.Meetings.Meeting

  @create_attrs %{
    date: "2010-04-17T14:00:00Z",
    description: "some description",
    name: "some name"
  }
  @update_attrs %{
    date: "2011-05-18T15:01:01Z",
    description: "some updated description",
    name: "some updated name"
  }
  @invalid_attrs %{date: nil, description: nil, name: nil}

  def fixture(:meeting) do
    {:ok, meeting} = Meetings.create_meeting(@create_attrs)
    meeting
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all meetings", %{conn: conn} do
      conn = get(conn, Routes.meeting_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create meeting" do
    test "renders meeting when data is valid", %{conn: conn} do
      conn = post(conn, Routes.meeting_path(conn, :create), meeting: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.meeting_path(conn, :show, id))

      assert %{
               "id" => id,
               "date" => "2010-04-17T14:00:00Z",
               "description" => "some description",
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.meeting_path(conn, :create), meeting: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update meeting" do
    setup [:create_meeting]

    test "renders meeting when data is valid", %{conn: conn, meeting: %Meeting{id: id} = meeting} do
      conn = put(conn, Routes.meeting_path(conn, :update, meeting), meeting: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.meeting_path(conn, :show, id))

      assert %{
               "id" => id,
               "date" => "2011-05-18T15:01:01Z",
               "description" => "some updated description",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, meeting: meeting} do
      conn = put(conn, Routes.meeting_path(conn, :update, meeting), meeting: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete meeting" do
    setup [:create_meeting]

    test "deletes chosen meeting", %{conn: conn, meeting: meeting} do
      conn = delete(conn, Routes.meeting_path(conn, :delete, meeting))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.meeting_path(conn, :show, meeting))
      end
    end
  end

  defp create_meeting(_) do
    meeting = fixture(:meeting)
    %{meeting: meeting}
  end
end
