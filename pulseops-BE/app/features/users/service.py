from sqlalchemy.orm import Session

from app.features.users.models import User


def get_users(db: Session) -> list[User]:
    return db.query(User).all()


def find_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()
