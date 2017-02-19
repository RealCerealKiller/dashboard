angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/dashboard.html',
    "<h1>Data</h1>\n" +
    "<h2 class='mt-35'>Your items ({{items ? items.length : \"loading...\"}})</h2>\n" +
    "<div class='mb-10 mt-n10 left'>\n" +
    "  <a class='mr-5' ng-click='selectAll()'>Select All</a>\n" +
    "  <a class='mr-5' ng-click='deleteData.showDelete = !deleteData.showDelete'>Delete Selected</a>\n" +
    "  <a class='mr-5' ng-click='showAdvanced = !showAdvanced'>Advanced</a>\n" +
    "</div>\n" +
    "<div class='mb-10 mt-n10 right'>\n" +
    "  <div class='right'>\n" +
    "    <a ng-click='paginatePrev()'>Previous</a>\n" +
    "    <a ng-click='paginateNext()'>Next</a>\n" +
    "  </div>\n" +
    "  <p class='clear'>Showing items {{currentItemsIndex}} - {{currentItemsIndex + subItems.length}} (out of {{items.length}})</p>\n" +
    "</div>\n" +
    "<div class='gray-bg clear' ng-if='deleteData.showDelete'>\n" +
    "  <p class='bold'>Choose deletion method:</p>\n" +
    "  <a class='block mt-5' ng-click='deleteSelectedWithSync()'>Delete and sync</a>\n" +
    "  <a class='block mt-5' ng-click='destroySelected()'>Delete and destroy</a>\n" +
    "  <p class='bold mt-10'>Delete and sync:</p>\n" +
    "  <p>\n" +
    "    This will delete the content from the database, such as title and text, but keep the metadata of the item in the database, such as ID and the date the item was modified.\n" +
    "    This will allow other devices to sync this item and remove it from their local copy.\n" +
    "  </p>\n" +
    "  <p class='bold mt-10'>Delete and destroy:</p>\n" +
    "  <p>\n" +
    "    This deletes the item completely and immediately from the database, and does not give other devices signed in to the account the chance to sync the deletion.\n" +
    "    You will instead have to manually delete the item from those devices.\n" +
    "  </p>\n" +
    "</div>\n" +
    "<div class='gray-bg clear' ng-if='showAdvanced'>\n" +
    "  <a class='block red' ng-click='destroyAll()'>Destroy all data</a>\n" +
    "  <p>Destroying all data will permanently delete all your data, without giving your devices the chance to sync the deletions. You should sign out of all devices before continuing with this option.</p>\n" +
    "</div>\n" +
    "<table class='mt-15 clear'>\n" +
    "  <tr>\n" +
    "    <th>Select</th>\n" +
    "    <th>Item ID</th>\n" +
    "    <th>Type</th>\n" +
    "    <th>Content</th>\n" +
    "    <th>Created</th>\n" +
    "    <th>Last Modified</th>\n" +
    "    <th>Deleted</th>\n" +
    "  </tr>\n" +
    "  <tr ng-repeat='item in subItems'>\n" +
    "    <td style='width: 4%; min-width: 50px;'>\n" +
    "      <input ng-model='item.checked' type='checkbox'>\n" +
    "    </td>\n" +
    "    <td style='min-width: 100px;'>\n" +
    "      <p>{{item.uuid}}</p>\n" +
    "    </td>\n" +
    "    <td style='min-width: 50px;'>\n" +
    "      <p>{{item.content_type}}</p>\n" +
    "    </td>\n" +
    "    <td style='min-width: 70px;'>\n" +
    "      <p class='clamp-2' style='max-height: 300px;'>{{item.content}}</p>\n" +
    "    </td>\n" +
    "    <td style='min-width: 70px;'>\n" +
    "      <p>{{item.created_at}}</p>\n" +
    "    </td>\n" +
    "    <td style='min-width: 105px;'>\n" +
    "      <p>{{item.updated_at}}</p>\n" +
    "    </td>\n" +
    "    <td>\n" +
    "      <p style='width: 60px;'>{{item.deleted}}</p>\n" +
    "    </td>\n" +
    "  </tr>\n" +
    "</table>\n"
  );


  $templateCache.put('templates/extensions.html',
    "<h1>Extensions</h1>\n" +
    "<p>Standard File extensions allow for your encrypted data to be backed up to multiple places, such as your Dropbox or Google Drive.</p>\n" +
    "<p class='mt-15'>When you make a change to your data (such as modifying a note using Standard Notes), Standard File will automatically backup this item to your backup locations.</p>\n" +
    "<p class='mt-15'>When you register a new extension, you should choose \"Perform Full Backup\" to perform an initial backup of your existing data.</p>\n" +
    "<h2 class='mt-25'>Registered extensions ({{extensions.length}})</h2>\n" +
    "<table class='mt-15 clear gray-bg'>\n" +
    "  <tr>\n" +
    "    <th>Secret URL</th>\n" +
    "    <th>ID</th>\n" +
    "    <th>Status</th>\n" +
    "    <th>Options</th>\n" +
    "  </tr>\n" +
    "  <tr ng-repeat='ext in extensions'>\n" +
    "    <td style='min-width: 70px;'>\n" +
    "      <p>{{ext.content.url}}</p>\n" +
    "    </td>\n" +
    "    <td style='min-width: 100px;'>\n" +
    "      <p>{{ext.uuid}}</p>\n" +
    "    </td>\n" +
    "    <th style='min-width: 100px;'>\n" +
    "      <p>Enabled</p>\n" +
    "    </th>\n" +
    "    <td style='min-width: 210px;'>\n" +
    "      <a class='block' ng-click='performBackupForExt(ext)' ng-if='!ext.requestSent &amp;&amp; !ext.requestReceived'>Perform Full Backup</a>\n" +
    "      <p class='strong' ng-if='ext.requestSent'>Sending request...</p>\n" +
    "      <p class='strong' ng-if='ext.requestReceived'>Backup queued successfully.</p>\n" +
    "    </td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "<div class='col-container'>\n" +
    "  <div class='col-50'>\n" +
    "    <h2 class='mt-25'>Add new extension</h2>\n" +
    "    <div class='mt-10' style='max-width: 400px;'>\n" +
    "      <input class='form-control' ng-model='formData.url' placeholder='Extension secret URL'>\n" +
    "      <button class='black' ng-click='addExtension()'>Add Extension</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class='col-50'>\n" +
    "    <h2 class='mt-25'>Available extensions</h2>\n" +
    "    <a class='block' href='https://extensions.standardnotes.org/dropbox' target='_blank'>Dropbox Backup</a>\n" +
    "    <a class='block' href='https://standardnotes.org/extensions/revision-history' target='_blank'>Note History</a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/home.html',
    "<section ng-if='!signedIn'>\n" +
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
    "</section>\n" +
    "<div class='col-container wrap' ng-if='signedIn' ng-init='showData = true'>\n" +
    "  <div class='col-15 mt-25 gray-bg' style='margin-right: 20px;'>\n" +
    "    <div class='mt-n15 clear'>\n" +
    "      <h3>Your Dashboard</h3>\n" +
    "      <p>{{user.email}}</p>\n" +
    "      <p>{{getServer()}}</p>\n" +
    "    </div>\n" +
    "    <a class='block mt-15' ng-click='showData = true; showExtensions = false;'>Data</a>\n" +
    "    <a class='block mt-5' ng-click='showData = false; showExtensions = true;'>Extensions</a>\n" +
    "    <a class='block mt-5' ng-click='signout()'>Sign out</a>\n" +
    "    <a class='block mt-35' href='https://standardfile.org' target='_blank'>Standard File</a>\n" +
    "  </div>\n" +
    "  <div class='col-80'>\n" +
    "    <div ng-controller='DashboardCtrl' ng-if='showData' ng-include='' src=\"'templates/dashboard.html'\"></div>\n" +
    "    <div ng-controller='ExtensionsCtrl' ng-if='showExtensions' ng-include='' src=\"'templates/extensions.html'\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/menu.html',
    ""
  );

}]);
