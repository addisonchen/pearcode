defmodule EventsApi.Repo.Migrations.CreateInvites do
  use Ecto.Migration

  def change do
    create table(:invites) do
      add :status, :string, null: false
      add :email, :string, null: false
      add :meeting_id, references(:meetings, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:invites, [:meeting_id])
  end
end
