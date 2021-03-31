defmodule EventsApiWeb.InviteView do
  use EventsApiWeb, :view
  alias EventsApiWeb.InviteView

  def render("index.json", %{invites: invites}) do
    %{data: render_many(invites, InviteView, "inviteExpanded.json")}
  end

  def render("show.json", %{invite: invite}) do
    %{data: render_one(invite, InviteView, "invite.json")}
  end

  def render("invite.json", %{invite: invite}) do
    %{id: invite.id,
      status: invite.status,
      email: invite.email}
  end

  def render("inviteExpanded.json", %{invite: invite}) do
    %{id: invite.id,
      status: invite.status,
      email: invite.email,
      meeting: invite.meeting }
  end
end
