from app.core.security import CurrentUser, get_current_user
from app.features.beds.schemas import (
    BedAdmitRequest,
    BedCreate,
    BedResponse,
    BedUpdate,
)
from app.features.beds.service import (
    admit_patient_to_bed,
    create_bed,
    delete_bed,
    get_bed_by_id,
    get_beds,
    release_bed,
    update_bed,
)
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/beds", tags=["Beds"])


@router.get("", response_model=list[BedResponse])
def list_beds(current_user: CurrentUser = Depends(get_current_user)):
    return get_beds()


@router.post("", response_model=BedResponse, status_code=201)
def add_bed(bed: BedCreate, current_user: CurrentUser = Depends(get_current_user)):
    return create_bed(bed)


@router.get("/{bed_id}", response_model=BedResponse)
def get_bed(bed_id: str, current_user: CurrentUser = Depends(get_current_user)):
    bed = get_bed_by_id(bed_id)

    if bed is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Bed not found")

    return bed


@router.put("/{bed_id}", response_model=BedResponse)
def edit_bed(
    bed_id: str, bed: BedUpdate, current_user: CurrentUser = Depends(get_current_user)
):
    updated = update_bed(bed_id, bed)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Bed not found")

    return updated


@router.post("/{bed_id}/admit", response_model=BedResponse)
def admit_bed(
    bed_id: str,
    admit_request: BedAdmitRequest,
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = admit_patient_to_bed(
        bed_id, admit_request.patient_id, admit_request.admitted_date
    )

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Bed not found")

    return updated


@router.post("/{bed_id}/release", response_model=BedResponse)
def release_bed_endpoint(
    bed_id: str, current_user: CurrentUser = Depends(get_current_user)
):
    updated = release_bed(bed_id)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Bed not found")

    return updated


@router.delete("/{bed_id}", response_model=BedResponse)
def remove_bed(bed_id: str, current_user: CurrentUser = Depends(get_current_user)):
    deleted = delete_bed(bed_id)

    if deleted is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Bed not found")

    return deleted
