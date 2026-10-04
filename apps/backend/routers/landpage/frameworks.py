from fastapi import Depends, Query

from routers.landpage import router
from routers.admin import partial_authenticated

from facades.landpage import Landpage
from models.landpage.frameworks import FrameworksResponse
from routers.landpage import Locale


@router.get('/frameworks', status_code = 200, response_model = FrameworksResponse)
async def get_frameworks(locale: Locale = Query(default = 'pt'), is_auth: bool = Depends(partial_authenticated)):
    return await Landpage(locale, is_auth = is_auth).frameworks()
