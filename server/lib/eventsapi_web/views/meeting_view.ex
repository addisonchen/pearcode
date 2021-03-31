defmodule EventsApiWeb.MeetingView do
  use EventsApiWeb, :view
  alias EventsApiWeb.MeetingView

  def render("index.json", %{meetings: meetings}) do
    %{data: render_many(meetings, MeetingView, "meeting.json")}
  end

  def render("showExpanded.json", %{meeting: meeting}) do
    %{data: render_one(meeting, MeetingView, "meetingExpanded.json")}
  end

  def render("show.json", %{meeting: meeting}) do
    %{data: render_one(meeting, MeetingView, "meeting.json")}
  end

  def render("meeting.json", %{meeting: meeting}) do
    %{id: meeting.id,
      name: meeting.name,
      date: meeting.date,
      description: meeting.description
    }
  end

  def render("meetingExpanded.json", %{meeting: meeting}) do
    %{id: meeting.id,
      name: meeting.name,
      date: meeting.date,
      description: meeting.description,
      invites: meeting.invites,
      comments: meeting.comments,
      user_name: meeting.user.name,
      user_id: meeting.user.id,
      user_email: meeting.user.email
    }
  end
end
