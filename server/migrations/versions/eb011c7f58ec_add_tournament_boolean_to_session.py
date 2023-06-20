"""Add tournament boolean to session

Revision ID: eb011c7f58ec
Revises: abc0b9da9b18
Create Date: 2023-06-20 13:09:47.080599

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import orm

import app.models as models


# revision identifiers, used by Alembic.
revision = 'eb011c7f58ec'
down_revision = 'abc0b9da9b18'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('session', schema=None) as batch_op:
        batch_op.add_column(sa.Column('tournament', sa.Boolean(), default=True))

    bind = op.get_bind()
    session = orm.Session(bind=bind)
    for s in session.query(models.Session):
        data: list[models.SessionData] = s.session_data.all()
        s.tournament = any(x for x in data if x.tournament_placement is not None)
    session.commit()

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('session', schema=None) as batch_op:
        batch_op.drop_column('tournament')

    # ### end Alembic commands ###
