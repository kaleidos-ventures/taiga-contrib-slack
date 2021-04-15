# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

from taiga.base.api.permissions import (TaigaResourcePermission, IsProjectAdmin,
                                        AllowAny)


class SlackHookPermission(TaigaResourcePermission):
    retrieve_perms = IsProjectAdmin()
    create_perms = IsProjectAdmin()
    update_perms = IsProjectAdmin()
    destroy_perms = IsProjectAdmin()
    list_perms = AllowAny()
    test_perms = IsProjectAdmin()
