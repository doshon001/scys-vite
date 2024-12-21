<template>
  <div class="flex">
    <div class="bg-white overflow-y-auto hidden-lg-and-down" style="width: 350px; height: 100vh;flex: 0 0 auto;">
      <div class="flex flex-col mt ml-2 overflow-hidden whitespace-nowrap">
        <div
          class="mt-2"
          v-for="item in docxInfo.data.header"
          :style="{ 
            'padding-left': handleHeader(item).num + 'rem',
            'cursor':'pointer' 
          }"
          :id="handleHeader(item).id"
          @click="handleClick(handleHeader(item).id)"
        >
          <span 
            v-for="header_item in handleHeader(item).data"
          >
            <span>
              {{ header_item.text_run.content }}
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="w-full overflow-y-auto">
      <div 
        class="mt ml mr text-left" 
        style="max-width: 800px;margin: 0 auto;height: 100vh;"
        id="docx-contenter"
      >
        <el-card 
          shadow="never"
          style="border-radius: 0.8rem;"
        >
          <div
            v-for="(item, index) in handleNode(docxInfo.data.page)"
            :id = "item.block_id"
            :index="index"
          >
            <template v-if="item.page && item.page.elements">
              <span
                v-for="page_item in item.page.elements"
              >
                <template v-if="page_item.text_run">
                  <span
                    class="text-size-6 font-700 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ page_item.text_run.content }}
                  </span>
                </template>
              </span>
              <div class="flex mt-2 justify-end">
                <el-button round>AI文档解读</el-button>
              </div>
            </template>
            <template v-else-if="item.image">
              <f-image
                :style="{                    
                  'max-width': '100%',
                  'max-height': '100vh',
                }"
                :re_src="handleReSrc(docxInfo.data.page.node, docxInfo.data.page.block_id)"
                :images="handleImage(item.image, docxInfo.data.page.block_id)"
              />
            </template>
            <template v-else-if="item.text && item.text.elements">
              <span
                v-for="text_item in item.text.elements"
              >
                <template v-if="text_item.text_run">
                  <span 
                    v-if="text_item.text_run.content == ''"
                    class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    <br>
                  </span>
                  <a
                    v-if="text_item.text_run.text_element_style && text_item.text_run.text_element_style.bold && text_item.text_run.text_element_style.link"
                    class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                    @click="handleLink(text_item.text_run.text_element_style.link.url)"
                  >
                    {{ text_item.text_run.content }}
                  </a>
                  <span
                    v-else-if="text_item.text_run.text_element_style && text_item.text_run.text_element_style.bold"
                    class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ text_item.text_run.content }}
                  </span>
                  <a
                    v-else-if="text_item.text_run.text_element_style && text_item.text_run.text_element_style.link"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                    @click="handleLink(text_item.text_run.text_element_style.link.url)"
                  >
                    {{ text_item.text_run.content }}
                  </a>
                  <span
                    v-else-if="text_item.text_run.text_element_style && text_item.text_run.text_element_style.bold == false"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ text_item.text_run.content }}
                  </span>
                </template>
                <template v-if="text_item.mention_user">
                  <span
                    v-if="text_item.mention_user.number"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    <f-user-avatar
                      :user="handleMentionUser(docxInfo.data.user, text_item.mention_user.number)"
                    />
                  </span>
                  <span
                    v-else-if="text_item.mention_user.name"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ text_item.mention_user.name }}
                  </span>
                </template>
                <template v-if="text_item.mention_doc">
                  <a
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                    @click="handleLink(text_item.mention_doc.url)"
                  >
                    {{ text_item.mention_doc.title }}
                  </a>
                </template>
              </span>
            </template>
            <template v-else-if="item.node && item.callout">
              <div
                style="border: 1px solid rgb(183, 237, 177); 
                  background: rgb(240, 251, 239); 
                  border-radius: 10px; 
                  position: relative; 
                  margin-top: 10px; 
                  padding: 10px 10px 10px 30px;"
              >
                <span style="font-size: 20px; position: absolute; left: 7px; top: 7px;">💡</span>
                <div
                  v-for="node_item in item.node"
                >
                  <template v-if="node_item.text">
                    <span
                      v-for="node_text_item in node_item.text.elements"
                    >
                      <template v-if="node_text_item.text_run">
                        <span 
                          v-if="node_text_item.text_run.content == ''"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          <br>
                        </span>
                        <a
                          v-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                        <a
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold == false"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                      </template>
                      <template v-if="node_text_item.mention_doc">
                        <a
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.mention_doc.url)"
                        >
                          {{ node_text_item.mention_doc.title }}
                        </a>
                      </template>
                    </span>
                  </template>
                  <template v-if="node_item.node">
                    <div
                      v-for="node_node_item in node_item.node"
                    >
                      <template v-if="node_node_item.text">
                        <span
                          v-for="node_node_text_item in node_node_item.text.elements"
                        >
                          <template v-if="node_node_text_item.text_run">
                            <span 
                              v-if="node_node_text_item.text_run.content == ''"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              <br>
                            </span>
                            <a
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold && node_node_text_item.text_run.text_element_style.link"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.text_run.text_element_style.link.url)"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </a>
                            <span
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </span>
                            <a
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.link"
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.text_run.text_element_style.link.url)"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </a>
                            <span
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold == false"
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </span>
                          </template>
                          <template v-if="node_node_text_item.mention_doc">
                            <a
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.mention_doc.url)"
                            >
                              {{ node_node_text_item.mention_doc.title }}
                            </a>
                          </template>
                        </span>
                      </template>
                      <template v-if="node_node_item.callout">
                        <span 
                          style="font-size: 20px; position: absolute; left: 7px; top: 7px;"
                        >💡</span>
                        <span
                          v-for="node_node_text_item in node_node_item.node"
                        >
                          <span
                            v-for="node_node_node_text_item in node_node_text_item.text.elements"
                          >
                            <template v-if="node_node_node_text_item.text_run">
                              <span 
                                v-if="node_node_node_text_item.text_run.content == ''"
                                class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              >
                                <br>
                              </span>
                              <a
                                v-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold && node_node_node_text_item.text_run.text_element_style.link"
                                class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                @click="handleLink(node_node_node_text_item.text_run.text_element_style.link.url)"
                              >
                                {{ node_node_node_text_item.text_run.content }}
                              </a>
                              <span
                                v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold"
                                class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              >
                                {{ node_node_node_text_item.text_run.content }}
                              </span>
                              <a
                                v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.link"
                                class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                @click="handleLink(node_node_node_text_item.text_run.text_element_style.link.url)"
                              >
                                {{ node_node_node_text_item.text_run.content }}
                              </a>
                              <span
                                v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold == false"
                                class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              >
                                {{ node_node_node_text_item.text_run.content }}
                              </span>
                            </template>
                            <template v-if="node_node_node_text_item.mention_doc">
                              <a
                                class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                @click="handleLink(node_node_node_text_item.mention_doc.url)"
                              >
                                {{ node_node_node_text_item.mention_doc.title }}
                              </a>
                            </template>
                          </span>
                        </span>
                      </template>
                      <template v-if="node_node_item.image">
                        <f-image
                          :style="{                    
                            'max-width': '100%',
                            'max-height': '100vh',
                          }"
                          :re_src="handleReSrc(item.node, docxInfo.data.page.block_id)"
                          :images="handleImage(node_node_item.image, docxInfo.data.page.block_id)"
                        />
                      </template>
                    </div>
                  </template>
                  <template v-if="node_item.heading">
                    <span
                      v-for="node_head_item in node_item[node_item.heading].elements"
                      class="font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                      :style="{'font-size': 22-(node_item.heading[node_item.heading.length-1]-1)*2+'px'}"
                    >
                      {{ node_head_item.text_run.content }}
                    </span>
                  </template>
                  <template v-if="node_item.ordered">
                    <span
                      v-for="node_text_item in node_item.ordered.elements"
                    >
                      <template v-if="node_text_item.text_run">
                        <span 
                          v-if="node_text_item.text_run.content == ''"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          <br>
                        </span>
                        <a
                          v-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                        <a
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold == false"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                      </template>
                      <template v-if="node_text_item.mention_doc">
                        <a
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.mention_doc.url)"
                        >
                          {{ node_text_item.mention_doc.title }}
                        </a>
                      </template>
                    </span>
                  </template>
                  <template v-if="node_item.bullet">
                    <div>
                      <span style="color: rgb(51, 112, 255); margin-right: 5px; font-size: 1.25rem;">•</span>
                      <span
                        v-for="node_bullet_item in node_item.bullet.elements"
                      >
                        <template v-if="node_bullet_item.text_run">
                          <span 
                            v-if="node_bullet_item.text_run.content == ''"
                            class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            <br>
                          </span>
                          <span
                            v-else-if="node_bullet_item.text_run.text_element_style && node_bullet_item.text_run.text_element_style.bold"
                            class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            {{ node_bullet_item.text_run.content }}
                          </span>
                          <span
                            v-else-if="node_bullet_item.text_run.text_element_style && node_bullet_item.text_run.text_element_style.bold == false"
                            class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            {{ node_bullet_item.text_run.content }}
                          </span>
                        </template>
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <template v-else-if="item.node && item.grid">
              <div class="flex flex-row">
                <div
                  v-for="node_item in item.node"
                  style="background-color: rgb(250, 250, 250);"
                  class="flex w-full flex-col flex-content-between mr-1 p-2"
                >
                  <template v-if="node_item.text">
                    <span
                      v-for="node_text_item in node_item.text.elements"
                    >
                      <template v-if="node_text_item.text_run">
                        <span 
                          v-if="node_text_item.text_run.content == ''"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          <br>
                        </span>
                        <a
                          v-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                        <a
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold == false"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                      </template>
                      <template v-if="node_text_item.mention_doc">
                        <a
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.mention_doc.url)"
                        >
                          {{ node_text_item.mention_doc.title }}
                        </a>
                      </template>
                    </span>
                  </template>
                  <template v-if="node_item.node">
                    <div
                      v-for="node_node_item in node_item.node"
                    >
                      <template v-if="node_node_item.text">
                        <span
                          v-for="node_node_text_item in node_node_item.text.elements"
                        >
                          <template v-if="node_node_text_item.text_run">
                            <span 
                              v-if="node_node_text_item.text_run.content == ''"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              <br>
                            </span>
                            <a
                              v-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold && node_node_text_item.text_run.text_element_style.link"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.text_run.text_element_style.link.url)"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </a>
                            <span
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </span>
                            <a
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.link"
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.text_run.text_element_style.link.url)"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </a>
                            <span
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold == false"
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </span>
                          </template>
                          <template v-if="node_node_text_item.mention_doc">
                            <a
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.mention_doc.url)"
                            >
                              {{ node_node_text_item.mention_doc.title }}
                            </a>
                          </template>
                        </span>
                      </template>
                      <template v-if="node_node_item.callout">
                        <div
                          style="border: 1px solid rgb(183, 237, 177); 
                            background: rgb(240, 251, 239); 
                            border-radius: 10px; 
                            position: relative; 
                            margin-top: 10px; 
                            padding: 10px 10px 10px 30px;"
                        >
                          <span 
                            style="font-size: 20px; position: absolute; left: 7px; top: 7px;"
                          >💡</span>
                          <span
                            v-for="node_node_text_item in node_node_item.node"
                          >
                            <span
                              v-for="node_node_node_text_item in node_node_text_item.text.elements"
                            >
                              <template v-if="node_node_node_text_item.text_run">
                                <span 
                                  v-if="node_node_node_text_item.text_run.content == ''"
                                  class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                >
                                  <br>
                                </span>
                                <a
                                  v-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold && node_node_node_text_item.text_run.text_element_style.link"
                                  class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                  @click="handleLink(node_node_node_text_item.text_run.text_element_style.link.url)"
                                >
                                  {{ node_node_node_text_item.text_run.content }}
                                </a>
                                <span
                                  v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold"
                                  class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                >
                                  {{ node_node_node_text_item.text_run.content }}
                                </span>
                                <a
                                  v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.link"
                                  class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                  @click="handleLink(node_node_node_text_item.text_run.text_element_style.link.url)"
                                >
                                  {{ node_node_node_text_item.text_run.content }}
                                </a>
                                <span
                                  v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold == false"
                                  class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                >
                                  {{ node_node_node_text_item.text_run.content }}
                                </span>
                              </template>
                              <template v-if="node_node_node_text_item.mention_doc">
                                <a
                                  class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                  @click="handleLink(node_node_node_text_item.mention_doc.url)"
                                >
                                  {{ node_node_node_text_item.mention_doc.title }}
                                </a>
                              </template>
                            </span>
                          </span>
                        </div>
                      </template>
                      <template v-if="node_node_item.image">
                        <f-image
                          :style="{                    
                            'max-width': '100%',
                            'max-height': '100vh',
                          }"
                          :re_src="handleReSrc(item.node, docxInfo.data.page.block_id)"
                          :images="handleImage(node_node_item.image, docxInfo.data.page.block_id)"
                        />
                      </template>
                    </div>
                  </template>
                  <template v-if="node_item.heading">
                    <span
                      v-for="node_head_item in node_item[node_item.heading].elements"
                      class="font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                      :style="{'font-size': 22-(node_item.heading[node_item.heading.length-1]-1)*2+'px'}"
                    >
                      {{ node_head_item.text_run.content }}
                    </span>
                  </template>
                  <template v-if="node_item.ordered">
                    <span
                      v-for="node_text_item in node_item.ordered.elements"
                    >
                      <template v-if="node_text_item.text_run">
                        <span 
                          v-if="node_text_item.text_run.content == ''"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          <br>
                        </span>
                        <a
                          v-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                        <a
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold == false"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                      </template>
                      <template v-if="node_text_item.mention_doc">
                        <a
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.mention_doc.url)"
                        >
                          {{ node_text_item.mention_doc.title }}
                        </a>
                      </template>
                    </span>
                  </template>
                  <template v-if="node_item.bullet">
                    <div>
                      <span style="color: rgb(51, 112, 255); margin-right: 5px; font-size: 1.25rem;">•</span>
                      <span
                        v-for="node_bullet_item in node_item.bullet.elements"
                      >
                        <template v-if="node_bullet_item.text_run">
                          <span 
                            v-if="node_bullet_item.text_run.content == ''"
                            class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            <br>
                          </span>
                          <span
                            v-else-if="node_bullet_item.text_run.text_element_style && node_bullet_item.text_run.text_element_style.bold"
                            class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            {{ node_bullet_item.text_run.content }}
                          </span>
                          <span
                            v-else-if="node_bullet_item.text_run.text_element_style && node_bullet_item.text_run.text_element_style.bold == false"
                            class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            {{ node_bullet_item.text_run.content }}
                          </span>
                        </template>
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <template v-else-if="item.node">
              <div
                style="
                  position: relative; 
                  padding: 10px 10px 10px 30px;"
              >
                <div
                  style="position: absolute; left: 2px; top: 10px; bottom: 10px; width: 2px; background: rgb(221, 221, 221);"
                ></div>
                <div
                  v-for="node_item in item.node"
                >
                  <template v-if="node_item.text">
                    <span
                      v-for="node_text_item in node_item.text.elements"
                    >
                      <template v-if="node_text_item.text_run">
                        <span 
                          v-if="node_text_item.text_run.content == ''"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          <br>
                        </span>
                        <a
                          v-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                        <a
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold == false"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                      </template>
                      <template v-if="node_text_item.mention_doc">
                        <a
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.mention_doc.url)"
                        >
                          {{ node_text_item.mention_doc.title }}
                        </a>
                      </template>
                    </span>
                  </template>
                  <template v-if="node_item.node">
                    <div
                      v-for="node_node_item in node_item.node"
                    >
                      <template v-if="node_node_item.text">
                        <span
                          v-for="node_node_text_item in node_node_item.text.elements"
                        >
                          <template v-if="node_node_text_item.text_run">
                            <span 
                              v-if="node_node_text_item.text_run.content == ''"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              <br>
                            </span>
                            <a
                              v-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold && node_node_text_item.text_run.text_element_style.link"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.text_run.text_element_style.link.url)"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </a>
                            <span
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold"
                              class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </span>
                            <a
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.link"
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.text_run.text_element_style.link.url)"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </a>
                            <span
                              v-else-if="node_node_text_item.text_run.text_element_style && node_node_text_item.text_run.text_element_style.bold == false"
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                            >
                              {{ node_node_text_item.text_run.content }}
                            </span>
                          </template>
                          <template v-if="node_node_text_item.mention_doc">
                            <a
                              class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                              @click="handleLink(node_node_text_item.mention_doc.url)"
                            >
                              {{ node_node_text_item.mention_doc.title }}
                            </a>
                          </template>
                        </span>
                      </template>
                      <template v-if="node_node_item.callout">
                        <div
                          style="border: 1px solid rgb(183, 237, 177); 
                            background: rgb(240, 251, 239); 
                            border-radius: 10px; 
                            position: relative; 
                            margin-top: 10px; 
                            padding: 10px 10px 10px 30px;"
                        >
                          <span 
                            style="font-size: 20px; position: absolute; left: 7px; top: 7px;"
                          >💡</span>
                          <span
                            v-for="node_node_text_item in node_node_item.node"
                          >
                            <span
                              v-for="node_node_node_text_item in node_node_text_item.text.elements"
                            >
                              <template v-if="node_node_node_text_item.text_run">
                                <span 
                                  v-if="node_node_node_text_item.text_run.content == ''"
                                  class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                >
                                  <br>
                                </span>
                                <a
                                  v-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold && node_node_node_text_item.text_run.text_element_style.link"
                                  class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                  @click="handleLink(node_node_node_text_item.text_run.text_element_style.link.url)"
                                >
                                  {{ node_node_node_text_item.text_run.content }}
                                </a>
                                <span
                                  v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold"
                                  class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                >
                                  {{ node_node_node_text_item.text_run.content }}
                                </span>
                                <a
                                  v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.link"
                                  class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                  @click="handleLink(node_node_node_text_item.text_run.text_element_style.link.url)"
                                >
                                  {{ node_node_node_text_item.text_run.content }}
                                </a>
                                <span
                                  v-else-if="node_node_node_text_item.text_run.text_element_style && node_node_node_text_item.text_run.text_element_style.bold == false"
                                  class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                >
                                  {{ node_node_node_text_item.text_run.content }}
                                </span>
                              </template>
                              <template v-if="node_node_node_text_item.mention_doc">
                                <a
                                  class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                                  @click="handleLink(node_node_node_text_item.mention_doc.url)"
                                >
                                  {{ node_node_node_text_item.mention_doc.title }}
                                </a>
                              </template>
                            </span>
                          </span>
                        </div>
                      </template>
                      <template v-if="node_node_item.image">
                        <f-image
                          :style="{                    
                            'max-width': '100%',
                            'max-height': '100vh',
                          }"
                          :re_src="handleReSrc(item.node, docxInfo.data.page.block_id)"
                          :images="handleImage(node_node_item.image, docxInfo.data.page.block_id)"
                        />
                      </template>
                    </div>
                  </template>
                  <template v-if="node_item.heading">
                    <span
                      v-for="node_head_item in node_item[node_item.heading].elements"
                      class="font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                      :style="{'font-size': 22-(node_item.heading[node_item.heading.length-1]-1)*2+'px'}"
                    >
                      {{ node_head_item.text_run.content }}
                    </span>
                  </template>
                  <template v-if="node_item.ordered">
                    <span
                      v-for="node_text_item in node_item.ordered.elements"
                    >
                      <template v-if="node_text_item.text_run">
                        <span 
                          v-if="node_text_item.text_run.content == ''"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          <br>
                        </span>
                        <a
                          v-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold"
                          class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                        <a
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.link"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.text_run.text_element_style.link.url)"
                        >
                          {{ node_text_item.text_run.content }}
                        </a>
                        <span
                          v-else-if="node_text_item.text_run.text_element_style && node_text_item.text_run.text_element_style.bold == false"
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                        >
                          {{ node_text_item.text_run.content }}
                        </span>
                      </template>
                      <template v-if="node_text_item.mention_doc">
                        <a
                          class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          @click="handleLink(node_text_item.mention_doc.url)"
                        >
                          {{ node_text_item.mention_doc.title }}
                        </a>
                      </template>
                    </span>
                  </template>
                  <template v-if="node_item.bullet">
                    <div>
                      <span style="color: rgb(51, 112, 255); margin-right: 5px; font-size: 1.25rem;">•</span>
                      <span
                        v-for="node_bullet_item in node_item.bullet.elements"
                      >
                        <template v-if="node_bullet_item.text_run">
                          <span 
                            v-if="node_bullet_item.text_run.content == ''"
                            class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            <br>
                          </span>
                          <span
                            v-else-if="node_bullet_item.text_run.text_element_style && node_bullet_item.text_run.text_element_style.bold"
                            class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            {{ node_bullet_item.text_run.content }}
                          </span>
                          <span
                            v-else-if="node_bullet_item.text_run.text_element_style && node_bullet_item.text_run.text_element_style.bold == false"
                            class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                          >
                            {{ node_bullet_item.text_run.content }}
                          </span>
                        </template>
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <template v-else-if="item.heading">
              <span
                v-for="head_item in item[item.heading].elements"
                class="font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                :style="{'font-size': 22-(item.heading[item.heading.length-1]-1)*2+'px'}"
              >
                {{ head_item.text_run.content }}
              </span>
            </template>
            <template v-else-if="item.bullet">
              <span style="color: rgb(51, 112, 255); margin-right: 5px; font-size: 1.25rem;">•</span>
              <span
                v-for="bullet_item in item.bullet.elements"
              >
                <template v-if="bullet_item.text_run">
                  <span 
                    v-if="bullet_item.text_run.content == ''"
                    class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    <br>
                  </span>
                  <span
                    v-else-if="bullet_item.text_run.text_element_style && bullet_item.text_run.text_element_style.bold"
                    class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ bullet_item.text_run.content }}
                  </span>
                  <span
                    v-else-if="bullet_item.text_run.text_element_style && bullet_item.text_run.text_element_style.bold == false"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ bullet_item.text_run.content }}
                  </span>
                </template>
              </span>
            </template>
            <template v-else-if="item.ordered">
              <span
                v-for="text_item in item.ordered.elements"
              >
                <template v-if="text_item.text_run">
                  <span 
                    v-if="text_item.text_run.content == ''"
                    class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    <br>
                  </span>
                  <a
                    v-if="text_item.text_run.text_element_style && text_item.text_run.text_element_style.bold && text_item.text_run.text_element_style.link"
                    class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                    @click="handleLink(text_item.text_run.text_element_style.link.url)"
                  >
                    {{ text_item.text_run.content }}
                  </a>
                  <span
                    v-else-if="text_item.text_run.text_element_style && text_item.text_run.text_element_style.bold"
                    class="text-size-4 font-700 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ text_item.text_run.content }}
                  </span>
                  <a
                    v-else-if="text_item.text_run.text_element_style && text_item.text_run.text_element_style.link"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                    @click="handleLink(text_item.text_run.text_element_style.link.url)"
                  >
                    {{ text_item.text_run.content }}
                  </a>
                  <span
                    v-else-if="text_item.text_run.text_element_style && text_item.text_run.text_element_style.bold == false"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ text_item.text_run.content }}
                  </span>
                </template>
                <template v-if="text_item.mention_user">
                  <span
                    v-if="text_item.mention_user.number"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    <f-user-avatar
                      :user="handleMentionUser(docxInfo.data.user, text_item.mention_user.number)"
                    />
                  </span>
                  <span
                    v-else-if="text_item.mention_user.name"
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                  >
                    {{ text_item.mention_user.name }}
                  </span>
                </template>
                <template v-if="text_item.mention_doc">
                  <a
                    class="text-size-4 line-height-7 break-anywhere break-all whitespace-break-spaces"
                    @click="handleLink(text_item.mention_doc.url)"
                  >
                    {{ text_item.mention_doc.title }}
                  </a>
                </template>
              </span>
            </template>
          </div>
        </el-card>
      </div>
    </div>
    <div class="position-absolute position-bottom-9xl position-right-2xl hidden-lg-and-up">
      <el-button 
        type="primary" 
        :icon="Menu" 
        circle 
        @click="drawer = true"
      >
      </el-button>
      <el-drawer 
        v-model="drawer" 
        direction="ltr"
        size="350"
      >
        <div class="flex flex-col mt ml-2 overflow-hidden whitespace-nowrap">
          <div
            class="mt-2"
            v-for="item in docxInfo.data.header"
            :style="{ 
              'padding-left': handleHeader(item).num + 'rem' 
            }"
            :id="handleHeader(item).id"
            @click="handleClick(handleHeader(item).id)"
          >
            <span 
              v-for="header_item in handleHeader(item).data"
            >
              <span>
                {{ header_item.text_run.content }}
              </span>
            </span>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { post } from '/@/utils/http/axios';
  import { useRoute } from 'vue-router';
  import { Menu } from '@element-plus/icons-vue';
  import FImage from '/@/components/FImage/docx.vue';
  import FUserAvatar from '/@/components/FUserAvatar/docx.vue';
  import CryptoJS from 'crypto-js';

  interface ParamData {
    docId: any;
  }
  interface DocxInfo {
    data: any;
    end_iso: any;
    error: any;
  }

  const drawer = ref(false);

  let request;
  let paramData = reactive<ParamData>({
    docId: '',
  });
  const docxInfo = reactive<DocxInfo>({
    data: [],
    end_iso: null,
    error: null,
  });
  const route = useRoute();

  const handleParam = () => {
    if (route.params.docId) {
      paramData['docId'] = route.params.docId;
    } else {
      delete paramData['docId'];
    };
  };

  const decryptData = (encryptedBase64: any, key: any, iv: any) => {
    const ivParams = CryptoJS.enc.Utf8.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
      iv: ivParams,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = CryptoJS.enc.Utf8.stringify(decrypted);
    return JSON.parse(decryptedStr);
  }

  const generateKeyAndIV = async (userId: any, saltBase64: any, info: any) => {
    const rawUserId = new TextEncoder().encode(userId);
    const rawSalt = base64ToArrayBuffer(saltBase64);
    const rawInfo = new TextEncoder().encode(info);

    // Derive key material using HKDF
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      rawUserId,
      { name: "HKDF" },
      false,
      ["deriveBits"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: rawSalt,
        info: rawInfo
      },
      keyMaterial,
      256 // 256 bits for the derived key
    );

    // Split derived bits into key and IV
    const keyBytes = derivedBits.slice(0, 16); // Key (first 256 bits / 32 bytes)
    const ivBytes = derivedBits.slice(16, 32); // IV (next 128 bits / 16 bytes)

    return {
      key: new Uint8Array(keyBytes),
      iv: new Uint8Array(ivBytes)
    };
  }

  const base64ToArrayBuffer = (base64: any) => {
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Usage
  const userId = '9a3554e9aa71558f80de55fc52e16a8b';
  const salt = 'TlFoOHhwZUtzWG9BdEpHRWpaY0tyUFliMG9hZ3pLOUM='; 
  const info = 'VGhpcyBpcyBhbiBpbXBvcnRhbnQgcGllY2Ugb2YgaW5mb3JtYXRpb24uIEl0J3MgZW5jcnlwdGVkLiBUaGFuayB5b3U=';

  const getDocxInfo = async () => {
    try {
      handleParam();
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getDocxInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const encodeData = await request;
      const { key, iv } = await generateKeyAndIV(userId, salt, info);
      docxInfo.data = decryptData(encodeData, key, iv);
    } catch (error: any) {
      docxInfo.error = error.message;
      console.log('Error:', docxInfo.error);
    }
  };

  const handleHeader = (item: any) => {
    const headObj: any = {
      data: null,
      num: 0,
      id: '',
    };
    const heading = item['heading'];
    const header = item[heading];
    const block_id = item['block_id'];
    headObj.data = header.elements;
    headObj.num = parseInt(heading.substr(-1)) - 1;
    headObj.id = block_id;
    return headObj
  };

  const handleNode = (item: any) => {
    if(item) {
      return item.node
    }
  };

  const handleImage = (item: any, id: any) => {
    if(item && item.token) {
      const images = [];
      const img_head = 'https://search01.shengcaiyoushu.com/upload/doc/' + id + '/';
      const token = item.token;
      const image_url = img_head + token;
      images.push(image_url)
      return images
    }
  };
  const handleReSrc = (items: any, id: any) => {
    const img_head = 'https://search01.shengcaiyoushu.com/upload/doc/' + id + '/';
    let token;
    let re_img;
    if(items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if(item.image) {
          token = item.image.token;
          re_img = img_head + token;
          break
        } else if(item.node) {
          for (let j = 0; j < item.node.length; j++) {
            const node = item.node[j];
            if(node.image) {
              token = node.image.token;
              re_img = img_head + token;
              break
            }
          }
          break
        } 
      }
    }
    return re_img
  };

  const parseUrl = async (item: any) => {
    const request = post({
      baseURL: import.meta.env.VITE_BASE_URL,
      url: '/parseUrl',
      data: {
        'url': item,
      },
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    })
    return await request
  }

  const handleLink = (item: any) => {
    const link = decodeURIComponent(item);
    if (link.startsWith('https://shengcaiyoushu01.feishu.cn/docx/') && link.includes('#')) {
      const urlPart = link.split('#');
      const anchor = urlPart[urlPart.length - 1];
      const contenter = document.getElementById('docx-contenter');
      if(contenter) {
        const element = contenter.querySelector(`#${anchor}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        };
      }
    } else if (link.startsWith('https://wx.zsxq.com') && link.includes('topic_detail')) {
      let href;
      const urlPart = link.split('/');
      const data = urlPart[urlPart.length - 1];
      const num = Number(data);
      if(!isNaN(num)) {
        href = '#/topicInfo/' + data;
      } else {
        href = '#/article/' + data;
      }
      window.open(href, '_blank');
    } else if (link.startsWith('https://articles.zsxq.com/')) {
      let href;
      var extractedContent = link.match(/_([^.]*)\.html/);
      if (extractedContent && extractedContent[1]) {
        const data = extractedContent[1];
        const num = Number(data);
        if(!isNaN(num)) {
          href = '#/topicInfo/' + data;
        } else {
          href = '#/article/' + data;
        }
        window.open(href, '_blank');
      }
    } else if (link.startsWith('https://t.zsxq.com/')) {
      let href;
      parseUrl(link).then((data) => {
        const num = Number(data);
        if(!isNaN(num)) {
          href = '#/topicInfo/' + data;
        } else {
          href = '#/article/' + data;
        }
        window.open(href, '_blank');
      });
    } else if (link.startsWith('https://i.shengcaiyoushu.com/docx/') || link.startsWith('https://search01.shengcaiyoushu.com/docx/')) {
      const urlPart = link.split('/');
      const url = urlPart[urlPart.length - 1];
      const href = '#/docx/' + url;
      window.open(href, '_blank');
    } else {
      window.open(link, '_blank');
    }
  };
  const handleMentionUser = (users: any, number: any) => {
    let re_user;
    if(users && number) {
      users.forEach((user: any) => {
        if(user.group_number === number) {
          re_user = user;
        }
      })
    }
    return re_user
  };

  const handleClick = (item: any) => {
    const contenter = document.getElementById('docx-contenter');
    if(contenter) {
      const element = contenter.querySelector(`#${item}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      };
    }
  }

  onMounted(() => {
    getDocxInfo();
  });
</script>

<style lang="less" scoped>
  @media screen and (max-width: 28rem) {
    //::v-deep .el-drawer {
    :deep(.el-drawer) {
      max-width: 90% !important;
    }
  }
  @media only screen and (max-width: 1200px) {
    .hidden-lg-and-down {
        display: none !important;
    }
  }
  @media only screen and (min-width: 1200px) {
    .hidden-lg-and-up {
        display: none !important;
    }
  }
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5rem;
  }
</style>
