from fastapi import Depends, Query

from routers.landpage import router
from routers.admin import partial_authenticated

from facades.landpage import Landpage
from models.landpage.experiences import ExperiencesResponse
from routers.landpage import Locale


@router.get('/experiences', status_code = 200, response_model = ExperiencesResponse)
async def get_experiences(locale: Locale = Query(default = 'pt'), is_auth: bool = Depends(partial_authenticated)):
    return await Landpage(locale, is_auth = is_auth).experiences()
