import React from 'react';

// You might consider moving the Header and potentially the MovieList/MovieCard sections
// into separate components later for better organization and reusability.
function App() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#181111] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      {/*
        Important: The <head> content (fonts, title, etc.) cannot be directly in a React component's render.
        React renders the <body>. For fonts, we'll handle them differently.
        The <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        is also NOT needed anymore, as you're using Tailwind CSS locally via npm.
      */}

      <div className="layout-container flex h-full grow flex-col">
        {/* Header Section */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#382929] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-white">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_330)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    {/* Note: IDs in SVG should be unique if multiple SVGs are on the page. */}
                    <clipPath id="clip0_6_330"><rect width="48" height="48" fill="white"></rect></clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">CineVerse</h2>
            </div>
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Movies</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">TV Shows</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">People</a>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64" htmlFor="search-header"> {/* Added htmlFor */}
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#b89d9d] flex border-none bg-[#382929] items-center justify-center pl-4 rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                    ></path>
                  </svg>
                </div>
                <input
                  id="search-header" // Added ID for htmlFor
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#382929] focus:border-none h-full placeholder:text-[#b89d9d] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value=""
                  readOnly // Added readOnly as value="" makes it controlled without onChange
                />
              </div>
            </label>
            <div className="flex gap-2">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e82626] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Register</span>
              </button>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#382929] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Login</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="px-24 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full flex-1">
            {/* Main Search Bar */}
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full" htmlFor="main-search"> {/* Added htmlFor */}
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div
                    className="text-[#b89d9d] flex border-none bg-[#382929] items-center justify-center pl-4 rounded-l-xl border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    id="main-search" // Added ID for htmlFor
                    placeholder="Search for movies, TV shows, people..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#382929] focus:border-none h-full placeholder:text-[#b89d9d] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value=""
                    readOnly // Added readOnly as value="" makes it controlled without onChange
                  />
                </div>
              </label>
            </div>

            {/* Scrollable Section (Example Movie Card - will be dynamic) */}
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDCxjOiA2O7iC5PpHXatL7s_2H4zQgeYb9MwPYkiIb1Rm4DtGgwBVG-KxxGzUsj6r-_nQQ0RH0kSx9lirUYKuFyI4lqfOWFXEAqy8SzMdHBSpsP3b-i_7bjKL1ReMtUhEgu61FqnP6pzQLoxAKX5mDs_K6Wb49c1gd8DP3Tc6H1S6jj5J1zMK4E9h18LtaoXX-MMnfrrb1lol1L8fzxTzoGd_zmNN8AM1dRO30KestprtKGxeR5EA7TREfCuGqxLUucKl97W4ig8b5T")' }}
                  ></div>
                  <div>
                    <p className="text-white text-base font-medium leading-normal">The Enigma Code</p>
                    <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 8.5</p>
                  </div>
                </div>
                {/* You'll replace this with dynamic content mapped from your API */}
              </div>
            </div>

            {/* Popular Movies Section */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Popular Movies</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-6 p-4">
              {/* These will be dynamic MovieCard components later */}
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2P-TNH2RNnCzKsv-tAym_uhCx05saAlECNPgktC-XWrZk3sdVNiE14RD5x1itJqzDmdK7xepiMVUtjrmT1y2wCn_IvnCGOQeA68fLacQQDK68PW60Zn4M9JuaVPNonLY-_u0htkmcP40PTzaNhAzjP3XiBpDnwx-9O7m5wy8FkhAKvXR2XWP_jBCZSfoubxrnEC_jtDZvzXM3vhfsatXnxRvMOardWsUFPARzvgjwg6CXubrE7DOCKFh2lgTpT4C8mhNDAE6WbWJp")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">The Enigma Code</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 8.5</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGTp9bmMHU6eKEQiul1Jv-uYPgiSpWHiMVV8W8mXRsGV31CNszqmxA-0nQDNchvuhNODfwgv0zG1BljM3mfRwEDt8JXzApaG48_sJfHlgmnieUvNEN7J5mUJru8exuiBEwU76ICfzzCJuUCtxHq4938R54CnyclapwW2X1k3pkgqfEvqBWKYRETlkXmPeaCYwRmZsIXEDVNsxhwcH0-hzbcysgWDM5_m9lRXY5JOuaq0T3lFTrJbKEerD4Cj20n26qutBgUj2oxNAw")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">Starlight Symphony</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 7.9</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDBEzaUvwQ-7WMIlVitL7KbHznxehDyfwjC0DXx777qatI8irCr65jT7MEF78uBKB4PMrItsTMAY_ZcUnqG2KU9RsOCGvqk7T1CgRl8wlFo25C6CcRuBnQTXGZdf7LpmkH_jlYgyhIQftHheRJovT6tuMuzK3sauFLS2qipwSXmtn0d3YFtQXJW3iqtNp4klyWdQIgXEP0gLdMVAhz0P_D-ldg-OVprRd4Ex2pb8i6AkrgYlLVwZqCGW1ALCiWsWRpad3krfLDA_qHe")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">Crimson Horizon</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 9.1</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPH5OmYT0_xxlsB5_YwJYpjuvM81lQCT2itqVb1m4h-NyIKeMYa4nlNHVEoe_MPbcHWRFG-uOC49jNrIXjR_W-YpU9d_hBxJAyOWLxc2LsEzNqJNYi4fOdaJkcDmL_nTpqojd0UNAaoZJLHhAFj4oovbZa8ZDFDLDns0jgF_6susOKNIpr6p4tNs9Dsf-ivTOZMMYG26dR--mrDiwmH_M51rLFlcdcudVKwDfq3dkO_aHBF_RBYGHIh3GRwAzWnH-wlN6BDBVwEv_W")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">Echoes of the Past</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 6.8</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxHmOuHDblWaeSDYeN-RyJGqYVcI4eidK5pxAYn9Sr91vKaMuU2GSYP4mrIN_FSG-lMclSQfRgOPknd00QokZWfi7PIJMxsHBV9XQbqvLyC9-fym4M0vQGz11Mz77ftrVb5f__OEdD0vG00U8ktVRUXSwE2ooY87Up2wBTNxOJ9WgqfNndGBadh0lMa0qu0Ctu5VN8kfM6xdhAORvXTfybnq6Sxdw0s-K07r8wYKh6OnvBvNvYtBYRGcaMjU7IalxE4zUuPGh2MNgw")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">Whispers of the Wind</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 8.2</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1MlbqNL_vLMZASm_erWjn6N0knbLl-x-8TlJcgUS0RyMPTOYgKGFY8AXP0tbvDWlrQz04vG6gDrbyN14JRFKaXLyQ0PP5kzPWF8MmPOiWGs6qHzA9NovulZhbIbNBNcFr1mPqgFPnJcgBwNI9IKQR4K6vGkfX5rqvW4lHwOTH37iCskFNQezs7Qjo6W_zxpxFfsroyjuKXWWYvFuCvsJ-KHoi1gtnbz8AV2p_D6g_ZRZhFph4_3iyi1fYQR9EPivE9ppVzSNhK4_v")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">The Last Frontier</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 7.5</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLKwiIGcLhx7mOWOsOFEnHAcP8mUDfqZFze6Q6qUhGi5SVXeOlR1GRtMAWWiuLWYuKGxFyikOAyGInzDE3a4PHelXJaXW9pv1tVdS9KhyatlFIzVRfTqrjMQ3RVi28eh4xnWJnZDUjoY-X2SIyq0cOgFx3a2059w0X4G2YCBwfVonbcr5ECtg6KWLwJJ5Und199L1aqkZaxdRhjoH6xJWAMRnh0Ou55zrtf2nQljXowDiH5uLa6g6fmExBH73ma1IPmMPxNhC1Fl1R")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">Shadows of Deception</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 8.8</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGEHyhrrxfqJB5CT93-XTaL5TYlHzFO_3_ssKFb7p7Nw5ClitFp1i1DA97pPDwdKYM1nTBPQkIRhcJQgxyfi_Ny9lbWxoxsDUnUtYInNWU6UTU8arT4fK3vEa43_bLcnQgV-sNIUwBCiMDh4J4IgMQL0WQtIEiHP4CEzey6XtfyzYqdBsl5i3amfHc4amsxCJoK9SmLi5eoHeXTKjvXSJ8Qbmo3vZZTR7OXgQELhWrqEVqqmJBAntUOoP77gvoePn-c095zY2PWg7K")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">Eternal Flame</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 9.2</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAi3nMdCQf3f7X60DAXsLQ7jjSTRvV0Om4sPDo1kOTLVISerCLoevV9Ab1w68uA-TbJSQFsJLrxnwTzUFcx1xC6oN2viCwtjtyKlfwhCgBDiaQb_1M2686UIUnDjLJNm_svBLJrnw-YRucbIxgGk2Hw051T3WvulioiE89sJys8kEbEnurRYpBf6mkvIEGx5wyM7EXizk5s81UhmpSr6EvWkZtUR6rrx6wvZQS19zrjfCOyfkAYu7gUw1ziGQRPp2u4NeBpIh1Or53")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">The Silent Witness</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 7.1</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqkmUgOjwCZCa4ZM2MmixL8VEOaBICev5sY0gEpLdT94mCnwbttUQOETJ0YCJdAdXkB8nleBZBpDMIOwPXE1IzKNnbgmUuXW3YcBCnZE8IU-1w7Kiglz71fUJ-qtNNDdnNUWIUDdkCpvO28zjxLsj6VCSzdSrwqPU50ii5W5zMx0gZzc5PGUQNMl6L81-djjkk976SFpABZWwCOHmnzfQmnwE-eGSrXpEnG8KuIWxu5_QssXLpZ6jNnav68Qy1xIUCPIRmfsDG8rfa")' }}
                ></div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">Beneath the Surface</p>
                  <p className="text-[#b89d9d] text-sm font-normal leading-normal">Rating: 8.0</p>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center p-4">
              <a href="#" className="flex size-10 items-center justify-center">
                <div className="text-white" data-icon="CaretLeft" data-size="18px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </div>
              </a>
              <a className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white rounded-full bg-[#382929]" href="#">1</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-white rounded-full" href="#">2</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-white rounded-full" href="#">3</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-white rounded-full" href="#">4</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-white rounded-full" href="#">5</a>
              <a href="#" className="flex size-10 items-center justify-center">
                <div className="text-white" data-icon="CaretRight" data-size="18px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;