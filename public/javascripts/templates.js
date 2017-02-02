angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/dashboard.html',
    "<div style='position: relative;'>\n" +
    "  <h1>Dashboard</h1>\n" +
    "  <a class='block' href='https://standardfile.org' style='position: absolute; right: 10px; top: 10px;' target='_blank'>Standard File</a>\n" +
    "  <div class='mt-n15 clear'>\n" +
    "    <p>{{user.email}}</p>\n" +
    "    <p>{{getServer()}}</p>\n" +
    "    <a class='block' ng-click='signout()'>Sign out</a>\n" +
    "  </div>\n" +
    "  <h2 class='mt-35'>Your items ({{items.length}})</h2>\n" +
    "  <div class='mb-10 mt-n10 left'>\n" +
    "    <a class='mr-5' ng-click='selectAll()'>Select All</a>\n" +
    "    <a class='mr-5' ng-click='showDelete = !showDelete'>Delete Selected</a>\n" +
    "    <a class='mr-5' ng-click='showAdvanced = !showAdvanced'>Advanced</a>\n" +
    "  </div>\n" +
    "  <div class='mb-10 mt-n10 right'>\n" +
    "    <div class='right'>\n" +
    "      <a ng-click='paginatePrev()'>Previous</a>\n" +
    "      <a ng-click='paginateNext()'>Next</a>\n" +
    "    </div>\n" +
    "    <p class='clear'>Showing items {{currentItemsIndex}} - {{currentItemsIndex + subItems.length}} (out of {{items.length}})</p>\n" +
    "  </div>\n" +
    "  <div class='gray-bg clear' ng-if='showDelete'>\n" +
    "    <p class='bold'>Choose deletion method:</p>\n" +
    "    <a class='block mt-5' ng-click='deleteSelectedWithSync()'>Delete and sync</a>\n" +
    "    <a class='block mt-5' ng-click='destroySelected()'>Delete and destroy</a>\n" +
    "    <p class='bold mt-10'>Delete and sync:</p>\n" +
    "    <p>\n" +
    "      This will delete the content from the database, such as title and text, but keep the metadata of the item in the database, such as ID and the date the item was modified.\n" +
    "      This will allow other devices to sync this item and remove it from their local copy.\n" +
    "    </p>\n" +
    "    <p class='bold mt-10'>Delete and destroy:</p>\n" +
    "    <p>\n" +
    "      This deletes the item completely and immediately from the database, and does not give other devices signed in to the account the chance to sync the deletion.\n" +
    "      You will instead have to manually delete the item from those devices.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div class='gray-bg clear' ng-if='showAdvanced'>\n" +
    "    <a class='block red' ng-click='destroyAll()'>Destroy all data</a>\n" +
    "    <p>Destroying all data will permanently delete all your data, without giving your devices the chance to sync the deletions. You should sign out of all devices before continuing with this option.</p>\n" +
    "  </div>\n" +
    "  <table class='mt-15 clear'>\n" +
    "    <tr>\n" +
    "      <th>Select</th>\n" +
    "      <th>Item ID</th>\n" +
    "      <th>Type</th>\n" +
    "      <th>Content</th>\n" +
    "      <th>Created</th>\n" +
    "      <th>Last Modified</th>\n" +
    "      <th>Deleted</th>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat='item in subItems'>\n" +
    "      <td style='width: 4%; min-width: 50px;'>\n" +
    "        <input ng-model='item.checked' type='checkbox'>\n" +
    "      </td>\n" +
    "      <td style='min-width: 100px;'>\n" +
    "        <p>{{item.uuid}}</p>\n" +
    "      </td>\n" +
    "      <td style='min-width: 50px;'>\n" +
    "        <p>{{item.content_type}}</p>\n" +
    "      </td>\n" +
    "      <td style='min-width: 70px;'>\n" +
    "        <p class='clamp-2' style='max-height: 300px;'>{{item.content}}</p>\n" +
    "      </td>\n" +
    "      <td style='min-width: 70px;'>\n" +
    "        <p>{{item.created_at}}</p>\n" +
    "      </td>\n" +
    "      <td style='min-width: 105px;'>\n" +
    "        <p>{{item.updated_at}}</p>\n" +
    "      </td>\n" +
    "      <td>\n" +
    "        <p style='width: 60px;'>{{item.deleted}}</p>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/home.html',
    "<section>\n" +
    "  <h1>Standard File Dashboard</h1>\n" +
    "  <form style='width: 400px; max-width: 400px; overflow: hidden;'>\n" +
    "    <input class='form-control' ng-model='formData.server' placeholder='Server URL'>\n" +
    "    <input class='form-control' ng-model='formData.email' placeholder='Email or unique identifier'>\n" +
    "    <p class='bold mt-15'>Enter your server password:</p>\n" +
    "    <em>Do not enter your login password here. Instead, use Standard Notes to find your \"Server\" password.</em>\n" +
    "    <input class='form-control mt-10' ng-model='formData.password' placeholder='Server password'>\n" +
    "    <button class='black mt-15' ng-click='submitLogin()'>Login</button>\n" +
    "    <div class='mt-15 red center-align bold' ng-if='formData.error'>\n" +
    "      Error: {{formData.error.message}}\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</section>\n"
  );

}]);
