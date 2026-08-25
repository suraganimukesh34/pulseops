from app.core.security import CurrentUser, get_current_user
from app.features.departments.schemas import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
)
from app.features.departments.service import (
    create_department,
    delete_department,
    get_department_by_id,
    get_departments,
    update_department,
)
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.get("", response_model=list[DepartmentResponse])
def list_departments(current_user: CurrentUser = Depends(get_current_user)):
    return get_departments()


@router.post("", response_model=DepartmentResponse, status_code=201)
def add_department(
    department: DepartmentCreate, current_user: CurrentUser = Depends(get_current_user)
):
    return create_department(department)


@router.get("/{department_id}", response_model=DepartmentResponse)
def get_department(
    department_id: str, current_user: CurrentUser = Depends(get_current_user)
):
    department = get_department_by_id(department_id)

    if department is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Department not found")

    return department


@router.put("/{department_id}", response_model=DepartmentResponse)
def edit_department(
    department_id: str,
    department: DepartmentUpdate,
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = update_department(department_id, department)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Department not found")

    return updated


@router.delete("/{department_id}", response_model=DepartmentResponse)
def remove_department(
    department_id: str, current_user: CurrentUser = Depends(get_current_user)
):
    deleted = delete_department(department_id)

    if deleted is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Department not found")

    return deleted
